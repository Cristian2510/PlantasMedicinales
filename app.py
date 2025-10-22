#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Robot de Ventas Hotmart - Backend Flask
API para webhook Hotmart, Web Push y FAQ
"""

import sys
import os
import json
import sqlite3
import hmac
import hashlib
from difflib import get_close_matches
from datetime import datetime
from flask import Flask, request, jsonify
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)

# ============================================
# CONFIGURACIÓN
# ============================================
DB_PATH = os.path.join(os.path.dirname(__file__), 'robot.db')
FAQS_PATH = os.path.join(os.path.dirname(__file__), 'faqs.json')
HOTMART_SECRET = os.getenv('HOTMART_WEBHOOK_SECRET', 'cambia_este_secreto')

# ============================================
# BASE DE DATOS
# ============================================
def get_db():
    """Conexión thread-safe a SQLite"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Inicializar base de datos desde db_init.sql"""
    sql_path = os.path.join(os.path.dirname(__file__), 'db_init.sql')
    
    if not os.path.exists(sql_path):
        print(f"❌ Error: No se encontró {sql_path}")
        sys.exit(1)
    
    with open(sql_path, 'r', encoding='utf-8') as f:
        sql_script = f.read()
    
    conn = get_db()
    conn.executescript(sql_script)
    conn.commit()
    conn.close()
    
    print(f"✅ Base de datos inicializada: {DB_PATH}")

# ============================================
# WEBHOOK HOTMART - SEGURIDAD
# ============================================
def verify_signature(payload_body, signature, secret):
    """
    Verificar firma HMAC SHA256 del webhook Hotmart
    
    Args:
        payload_body: bytes del body original
        signature: header X-Hotmart-Signature
        secret: HOTMART_WEBHOOK_SECRET
    
    Returns:
        bool: True si la firma es válida
    """
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload_body,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected_signature, signature)

# ============================================
# RUTAS - API
# ============================================

@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'ok', 'timestamp': datetime.utcnow().isoformat()})

@app.route('/qa', methods=['GET'])
def qa_search():
    """
    Buscar FAQ por similitud de texto
    GET /qa?q=texto
    """
    query = request.args.get('q', '').strip()
    
    if not query:
        return jsonify({'error': 'Parámetro "q" requerido'}), 400
    
    # Cargar FAQs
    try:
        with open(FAQS_PATH, 'r', encoding='utf-8') as f:
            faqs = json.load(f)
    except Exception as e:
        return jsonify({'error': f'Error al cargar FAQs: {str(e)}'}), 500
    
    # Buscar mejor coincidencia por pregunta
    questions = [faq['q'] for faq in faqs]
    matches = get_close_matches(query, questions, n=1, cutoff=0.3)
    
    if not matches:
        return jsonify({'q': None, 'a': None, 'message': 'No se encontró respuesta'})
    
    # Retornar FAQ más cercano
    best_match = matches[0]
    for faq in faqs:
        if faq['q'] == best_match:
            return jsonify({'q': faq['q'], 'a': faq['a']})
    
    return jsonify({'q': None, 'a': None})

@app.route('/api/save-sub', methods=['POST'])
def save_subscription():
    """
    Guardar suscripción Web Push
    POST /api/save-sub
    Body: {"endpoint": "...", "p256dh": "...", "auth": "..."}
    """
    data = request.get_json()
    
    if not data or not all(k in data for k in ['endpoint', 'p256dh', 'auth']):
        return jsonify({'error': 'Faltan campos: endpoint, p256dh, auth'}), 400
    
    try:
        conn = get_db()
        conn.execute('''
            INSERT OR IGNORE INTO push_subs (endpoint, p256dh, auth)
            VALUES (?, ?, ?)
        ''', (data['endpoint'], data['p256dh'], data['auth']))
        conn.commit()
        conn.close()
        
        return jsonify({'success': True, 'message': 'Suscripción guardada'})
    
    except Exception as e:
        return jsonify({'error': f'Error al guardar: {str(e)}'}), 500

@app.route('/webhook/hotmart', methods=['POST'])
def webhook_hotmart():
    """
    Webhook Hotmart - Recibir eventos de compra
    POST /webhook/hotmart
    
    PRODUCCIÓN: Descomentar validación de firma HMAC
    """
    # ==== SEGURIDAD: DESCOMENTAR EN PRODUCCIÓN ====
    # signature = request.headers.get('X-Hotmart-Signature', '')
    # if not signature:
    #     return jsonify({'error': 'Falta firma'}), 401
    # 
    # if not verify_signature(request.data, signature, HOTMART_SECRET):
    #     return jsonify({'error': 'Firma inválida'}), 401
    # ==============================================
    
    try:
        data = request.get_json(force=True, silent=True)
        
        if not data:
            return jsonify({'error': 'Body vacío o JSON inválido'}), 400
        
        # Extraer campos comunes del webhook Hotmart
        event_id = data.get('id', '')
        event_type = data.get('event', '')
        
        # Extraer email del comprador (puede variar según tipo de evento)
        buyer_email = ''
        if 'data' in data and 'buyer' in data['data']:
            buyer_email = data['data']['buyer'].get('email', '')
        
        status = data.get('data', {}).get('purchase', {}).get('status', '')
        
        # Guardar en DB
        conn = get_db()
        conn.execute('''
            INSERT OR IGNORE INTO hotmart_events 
            (event_id, event_type, buyer_email, status, raw_json)
            VALUES (?, ?, ?, ?, ?)
        ''', (event_id, event_type, buyer_email, status, json.dumps(data)))
        conn.commit()
        conn.close()
        
        print(f"✅ Webhook recibido: {event_type} | {buyer_email}")
        
        return jsonify({'success': True, 'event': event_type}), 200
    
    except Exception as e:
        print(f"❌ Error en webhook: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ============================================
# SERVIR ESTÁTICO (OPCIONAL)
# ============================================
# Descomentar si querés servir el PWA desde Flask (puerto único)
# from flask import send_from_directory
# 
# SITE_PATH = os.path.join(os.path.dirname(__file__), '..', 'site')
# 
# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve_static(path):
#     if path and os.path.exists(os.path.join(SITE_PATH, path)):
#         return send_from_directory(SITE_PATH, path)
#     return send_from_directory(SITE_PATH, 'index.html')

# ============================================
# CORS (si frontend y backend están en puertos distintos)
# ============================================
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

# ============================================
# MAIN
# ============================================
if __name__ == '__main__':
    # Modo inicialización: python app.py --initdb
    if len(sys.argv) > 1 and sys.argv[1] == '--initdb':
        init_db()
        sys.exit(0)
    
    # Verificar que existe la DB - si no existe, crearla automáticamente
    if not os.path.exists(DB_PATH):
        print("📊 Base de datos no existe. Creando automáticamente...")
        init_db()
        print("✅ Base de datos creada exitosamente")
    
    # Levantar servidor
    print("🚀 Robot de Ventas Hotmart - Backend Flask")
    print(f"📊 Base de datos: {DB_PATH}")
    print(f"🔐 Webhook secret: {'*' * len(HOTMART_SECRET)}")
    print("=" * 60)
    
    # Configuración para Railway
    port = int(os.environ.get('PORT', 5000))
    host = '0.0.0.0' if os.environ.get('RAILWAY_ENVIRONMENT') else '127.0.0.1'
    debug = not os.environ.get('RAILWAY_ENVIRONMENT')
    
    app.run(host=host, port=port, debug=debug)

