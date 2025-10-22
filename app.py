#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Robot de Ventas Hotmart - Backend Flask
API para webhook Hotmart, Web Push y FAQ
"""

import sys
import os
import json
import psycopg2
import psycopg2.extras
import hmac
import hashlib
from difflib import get_close_matches
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, redirect
from dotenv import load_dotenv
from urllib.parse import urlparse

# Cargar variables de entorno
load_dotenv()

# ============================================
# CONFIGURACIÓN
# ============================================

app = Flask(__name__)

# Variables de entorno
HOTMART_SECRET = os.getenv('HOTMART_WEBHOOK_SECRET', 'default-secret')
BASE_URL = os.getenv('BASE_URL_PUBLICA', 'http://localhost:5000')
VAPID_PUBLIC_KEY = os.getenv('VAPID_PUBLIC_KEY', '')
VAPID_PRIVATE_KEY = os.getenv('VAPID_PRIVATE_KEY', '')

# Configuración de base de datos PostgreSQL
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///robot.db')

# Directorio de archivos estáticos
SITE_DIR = os.path.join(os.path.dirname(__file__), 'site')

# ============================================
# CONEXIÓN A BASE DE DATOS
# ============================================

def get_db_connection():
    """Obtener conexión a la base de datos"""
    if DATABASE_URL.startswith('postgresql://'):
        # PostgreSQL
        return psycopg2.connect(DATABASE_URL)
    else:
        # SQLite (fallback)
        import sqlite3
        return sqlite3.connect('robot.db')

def init_db():
    """Inicializar base de datos"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Crear tablas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS push_subs (
                id SERIAL PRIMARY KEY,
                endpoint TEXT NOT NULL,
                p256dh TEXT NOT NULL,
                auth TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS hotmart_events (
                id SERIAL PRIMARY KEY,
                event_type TEXT NOT NULL,
                data JSONB NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS faqs (
                id SERIAL PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        print("✅ Base de datos PostgreSQL inicializada correctamente")
        
    except Exception as e:
        print(f"❌ Error inicializando base de datos: {e}")
        conn.rollback()
    finally:
        conn.close()

# ============================================
# RUTAS PRINCIPALES
# ============================================

@app.route('/')
def index():
    """Página principal"""
    return send_from_directory(SITE_DIR, 'index.html')

@app.route('/ventas')
def ventas():
    """Página de ventas principal - Enciclopedia Plantas Medicinales"""
    return send_from_directory(SITE_DIR, 'ventas-plantas-medicinales.html')

@app.route('/plantas-medicinales')
def plantas():
    """Alias para página de ventas"""
    return send_from_directory(SITE_DIR, 'ventas-plantas-medicinales.html')

# ============================================
# SERVIR ARCHIVOS ESTÁTICOS
# ============================================

@app.route('/<path:filename>')
def serve_static(filename):
    """Servir archivos estáticos (CSS, JS, imágenes)"""
    return send_from_directory(SITE_DIR, filename)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Servir assets (iconos, imágenes)"""
    assets_dir = os.path.join(SITE_DIR, 'assets')
    return send_from_directory(assets_dir, filename)

# ============================================
# API ENDPOINTS
# ============================================

@app.route('/api/push/subscribe', methods=['POST'])
def push_subscribe():
    """Suscribir usuario a notificaciones push"""
    try:
        data = request.json
        endpoint = data.get('endpoint')
        p256dh = data.get('keys', {}).get('p256dh')
        auth = data.get('keys', {}).get('auth')
        
        if not all([endpoint, p256dh, auth]):
            return jsonify({'error': 'Datos incompletos'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verificar si ya existe
        cursor.execute('SELECT id FROM push_subs WHERE endpoint = %s', (endpoint,))
        if cursor.fetchone():
            return jsonify({'message': 'Ya suscrito'}), 200
        
        # Insertar nueva suscripción
        cursor.execute('''
            INSERT INTO push_subs (endpoint, p256dh, auth) 
            VALUES (%s, %s, %s)
        ''', (endpoint, p256dh, auth))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Suscrito correctamente'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/faq', methods=['GET'])
def get_faq():
    """Obtener FAQ basado en pregunta"""
    try:
        question = request.args.get('q', '').lower()
        if not question:
            return jsonify({'error': 'Pregunta requerida'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Buscar coincidencias
        cursor.execute('SELECT question, answer FROM faqs')
        faqs = cursor.fetchall()
        
        # Buscar la mejor coincidencia
        questions = [faq[0].lower() for faq in faqs]
        matches = get_close_matches(question, questions, n=1, cutoff=0.6)
        
        if matches:
            best_match = matches[0]
            for faq in faqs:
                if faq[0].lower() == best_match:
                    return jsonify({
                        'question': faq[0],
                        'answer': faq[1]
                    }), 200
        
        conn.close()
        return jsonify({'error': 'No se encontró respuesta'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/webhook/hotmart', methods=['POST'])
def hotmart_webhook():
    """Webhook para eventos de Hotmart"""
    try:
        # Verificar firma (opcional para desarrollo)
        signature = request.headers.get('X-Hotmart-Hottok')
        
        data = request.json
        event_type = data.get('event')
        
        # Guardar evento en base de datos
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO hotmart_events (event_type, data) 
            VALUES (%s, %s)
        ''', (event_type, json.dumps(data)))
        
        conn.commit()
        conn.close()
        
        # Procesar evento
        if event_type == 'PURCHASE_COMPLETE':
            buyer_email = data.get('data', {}).get('buyer', {}).get('email')
            if buyer_email:
                print(f"✅ Nueva venta: {buyer_email}")
        
        return jsonify({'status': 'success'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(e):
    """Página no encontrada - redirigir a inicio"""
    return redirect('/')

# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    # Modo inicialización: python app.py --initdb
    if len(sys.argv) > 1 and sys.argv[1] == '--initdb':
        init_db()
        sys.exit(0)
    
    # Verificar que existe la DB - si no existe, crearla automáticamente
    try:
        conn = get_db_connection()
        conn.close()
        print("✅ Conexión a base de datos exitosa")
    except Exception as e:
        print(f"📊 Base de datos no existe. Creando automáticamente...")
        init_db()
        print("✅ Base de datos creada exitosamente")
    
    # Configuración para Railway
    port = int(os.environ.get('PORT', 5000))
    host = '0.0.0.0' if os.environ.get('RAILWAY_ENVIRONMENT') else '127.0.0.1'
    debug = not os.environ.get('RAILWAY_ENVIRONMENT')
    
    # Levantar servidor
    print("🚀 Robot de Ventas Hotmart - Backend Flask")
    print(f"📊 Base de datos: {DATABASE_URL[:20]}...")
    print(f"🔐 Webhook secret: {'*' * len(HOTMART_SECRET)}")
    print("=" * 60)
    
    app.run(host=host, port=port, debug=debug)