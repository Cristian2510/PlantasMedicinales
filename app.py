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
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:mbxloLXbsYYceOKxrXKuTcngXWLxvsSE@postgres.railway.internal:5432/railway')

# Directorio de archivos estáticos
SITE_DIR = os.path.join(os.path.dirname(__file__), 'site')

# ============================================
# CONEXIÓN A BASE DE DATOS
# ============================================

def get_db_connection():
    """Obtener conexión a la base de datos PostgreSQL"""
    try:
        print(f"🔗 Conectando a PostgreSQL: {DATABASE_URL[:30]}...")
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"❌ Error conectando a PostgreSQL: {e}")
        raise e

def init_db():
    """Inicializar base de datos PostgreSQL"""
    print("📊 Inicializando base de datos PostgreSQL...")
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Tabla de suscripciones Web Push
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS push_subs (
                id SERIAL PRIMARY KEY,
                endpoint TEXT NOT NULL UNIQUE,
                p256dh TEXT NOT NULL,
                auth TEXT NOT NULL,
                user_agent TEXT,
                ip_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla de eventos de Hotmart (ventas)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS hotmart_events (
                id SERIAL PRIMARY KEY,
                event_type TEXT NOT NULL,
                transaction_id TEXT UNIQUE,
                buyer_email TEXT,
                buyer_name TEXT,
                buyer_country TEXT,
                product_name TEXT,
                product_price DECIMAL(10,2),
                currency TEXT DEFAULT 'USD',
                purchase_date TIMESTAMP,
                data JSONB NOT NULL,
                processed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla de FAQs
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS faqs (
                id SERIAL PRIMARY KEY,
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                category TEXT DEFAULT 'general',
                keywords TEXT[],
                views INTEGER DEFAULT 0,
                helpful INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla de productos digitales
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                price DECIMAL(10,2),
                currency TEXT DEFAULT 'USD',
                hotmart_link TEXT,
                category TEXT,
                status TEXT DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla de visitantes/leads
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS visitors (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE,
                name TEXT,
                country TEXT,
                source TEXT,
                utm_source TEXT,
                utm_medium TEXT,
                utm_campaign TEXT,
                subscribed BOOLEAN DEFAULT FALSE,
                last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla de notificaciones enviadas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                url TEXT,
                sent_count INTEGER DEFAULT 0,
                opened_count INTEGER DEFAULT 0,
                clicked_count INTEGER DEFAULT 0,
                status TEXT DEFAULT 'draft',
                scheduled_at TIMESTAMP,
                sent_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insertar FAQs iniciales
        cursor.execute('''
            INSERT INTO faqs (question, answer, category, keywords) VALUES
            ('¿Qué plantas medicinales son mejores para el dolor de cabeza?', 
             'La menta, lavanda y jengibre son especialmente efectivas para dolores de cabeza. La menta contiene mentol que relaja los músculos, la lavanda reduce la tensión y el jengibre tiene propiedades antiinflamatorias.', 
             'plantas', 
             ARRAY['dolor', 'cabeza', 'menta', 'lavanda', 'jengibre']),
            ('¿Cómo cultivar plantas medicinales en casa?', 
             'La mayoría de hierbas curativas se pueden cultivar en macetas. Necesitas luz solar, buen drenaje y riego moderado. Plantas como menta, manzanilla, albahaca y orégano son ideales para principiantes.', 
             'cultivo', 
             ARRAY['cultivar', 'casa', 'macetas', 'hierbas']),
            ('¿Es seguro usar plantas medicinales con medicamentos?', 
             'Algunas plantas pueden interactuar con medicamentos. Por ejemplo, el ginkgo puede aumentar el sangrado con anticoagulantes. Siempre consulta con tu médico antes de combinar plantas con medicamentos.', 
             'seguridad', 
             ARRAY['medicamentos', 'interacciones', 'seguro', 'consulta'])
            ON CONFLICT DO NOTHING
        ''')
        
        # Insertar producto inicial
        cursor.execute('''
            INSERT INTO products (name, description, price, currency, hotmart_link, category) VALUES
            ('Enciclopedia de Plantas Medicinales', 
             'Guía completa con más de 550 hierbas medicinales, preparados caseros, cultivo y propiedades terapéuticas', 
             29.99, 
             'USD', 
             'https://go.hotmart.com/H102540942W', 
             'libros-digitales')
            ON CONFLICT DO NOTHING
        ''')
        
        conn.commit()
        print("✅ Base de datos PostgreSQL inicializada correctamente")
        print("✅ Tablas creadas: push_subs, hotmart_events, faqs, products, visitors, notifications")
        print("✅ FAQs y producto inicial insertados")
        
    except Exception as e:
        print(f"❌ Error inicializando base de datos: {e}")
        conn.rollback()
        raise e
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
        event_data = data.get('data', {})
        
        # Guardar evento en base de datos con datos estructurados
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Extraer datos del comprador
        buyer = event_data.get('buyer', {})
        product = event_data.get('product', {})
        transaction = event_data.get('transaction', {})
        
        cursor.execute('''
            INSERT INTO hotmart_events (
                event_type, transaction_id, buyer_email, buyer_name, 
                buyer_country, product_name, product_price, currency, 
                purchase_date, data
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (transaction_id) DO UPDATE SET
                processed = FALSE,
                data = EXCLUDED.data
        ''', (
            event_type,
            transaction.get('transaction_id'),
            buyer.get('email'),
            buyer.get('name'),
            buyer.get('country'),
            product.get('name'),
            product.get('price'),
            transaction.get('currency', 'USD'),
            transaction.get('purchase_date'),
            json.dumps(data)
        ))
        
        conn.commit()
        conn.close()
        
        # Procesar evento
        if event_type == 'PURCHASE_COMPLETE':
            buyer_email = buyer.get('email')
            product_name = product.get('name')
            if buyer_email:
                print(f"✅ Nueva venta: {buyer_email} - {product_name}")
                
                # Aquí podrías enviar notificación push, email, etc.
        
        return jsonify({'status': 'success'}), 200
        
    except Exception as e:
        print(f"❌ Error en webhook Hotmart: {e}")
        return jsonify({'error': str(e)}), 500

# ============================================
# RUTAS DE ADMINISTRACIÓN
# ============================================

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Obtener estadísticas del negocio"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Estadísticas de ventas
        cursor.execute('''
            SELECT 
                COUNT(*) as total_ventas,
                SUM(product_price) as total_ingresos,
                COUNT(DISTINCT buyer_email) as compradores_unicos,
                COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as ventas_hoy
            FROM hotmart_events 
            WHERE event_type = 'PURCHASE_COMPLETE'
        ''')
        sales_stats = cursor.fetchone()
        
        # Estadísticas de suscripciones
        cursor.execute('SELECT COUNT(*) FROM push_subs')
        total_subs = cursor.fetchone()[0]
        
        # Estadísticas de FAQs
        cursor.execute('SELECT COUNT(*) FROM faqs')
        total_faqs = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'ventas': {
                'total': sales_stats[0] or 0,
                'ingresos': float(sales_stats[1] or 0),
                'compradores_unicos': sales_stats[2] or 0,
                'ventas_hoy': sales_stats[3] or 0
            },
            'suscripciones': total_subs,
            'faqs': total_faqs
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ventas', methods=['GET'])
def get_ventas():
    """Obtener lista de ventas"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT buyer_email, buyer_name, product_name, product_price, 
                   currency, purchase_date, created_at
            FROM hotmart_events 
            WHERE event_type = 'PURCHASE_COMPLETE'
            ORDER BY created_at DESC
            LIMIT 50
        ''')
        
        ventas = []
        for row in cursor.fetchall():
            ventas.append({
                'email': row[0],
                'nombre': row[1],
                'producto': row[2],
                'precio': float(row[3] or 0),
                'moneda': row[4],
                'fecha_compra': row[5].isoformat() if row[5] else None,
                'fecha_registro': row[6].isoformat() if row[6] else None
            })
        
        conn.close()
        return jsonify({'ventas': ventas}), 200
        
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
    
    # Inicializar base de datos PostgreSQL siempre
    print("📊 Inicializando base de datos PostgreSQL...")
    try:
        init_db()
        print("✅ Base de datos PostgreSQL inicializada correctamente")
    except Exception as e:
        print(f"❌ Error inicializando base de datos: {e}")
        print("🔄 Reintentando conexión...")
        try:
            conn = get_db_connection()
            conn.close()
            print("✅ Conexión a PostgreSQL exitosa")
        except Exception as e2:
            print(f"❌ Error crítico: {e2}")
            sys.exit(1)
    
    # Configuración para Railway
    port = int(os.environ.get('PORT', 8080))  # Railway usa puerto 8080 por defecto
    host = '0.0.0.0'  # Siempre escuchar en todas las interfaces
    debug = False  # Siempre modo producción en Railway
    
    print(f"🌐 Configuración del servidor:")
    print(f"   Host: {host}")
    print(f"   Puerto: {port}")
    print(f"   Debug: {debug}")
    
    # Levantar servidor
    print("🚀 Robot de Ventas Hotmart - Backend Flask")
    print(f"📊 Base de datos: PostgreSQL")
    print(f"🔐 Webhook secret: {'*' * len(HOTMART_SECRET)}")
    print("=" * 60)
    
    app.run(host=host, port=port, debug=debug)