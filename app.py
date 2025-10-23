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
    """Obtener conexión a la base de datos (PostgreSQL o SQLite)"""
    db_url = os.getenv('DATABASE_URL')
    
    if db_url and db_url.startswith('postgresql'):
        try:
            print(f"🔗 Conectando a PostgreSQL: {db_url.split('@')[0]}...")
            conn = psycopg2.connect(db_url)
            return conn
        except Exception as e:
            print(f"❌ Error conectando a PostgreSQL: {e}")
            raise e
    else:
        # SQLite (fallback)
        import sqlite3
        print(f"🔗 Conectando a SQLite: {db_url or 'robot.db'}...")
        return sqlite3.connect('robot.db')

def init_db():
    """Inicializar base de datos (PostgreSQL o SQLite)"""
    db_url = os.getenv('DATABASE_URL')
    is_postgresql = db_url and db_url.startswith('postgresql')
    
    if is_postgresql:
        print("📊 Inicializando base de datos PostgreSQL...")
    else:
        print("📊 Inicializando base de datos SQLite...")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Definir tipos de datos según la base de datos
        if is_postgresql:
            id_type = "SERIAL PRIMARY KEY"
            json_type = "JSONB"
            array_type = "TEXT[]"
        else:
            id_type = "INTEGER PRIMARY KEY AUTOINCREMENT"
            json_type = "TEXT"
            array_type = "TEXT"
        # Tabla de suscripciones Web Push
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS push_subs (
                id {id_type},
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
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS hotmart_events (
                id {id_type},
                event_type TEXT NOT NULL,
                transaction_id TEXT UNIQUE,
                buyer_email TEXT,
                buyer_name TEXT,
                buyer_country TEXT,
                product_name TEXT,
                product_price DECIMAL(10,2),
                currency TEXT DEFAULT 'USD',
                purchase_date TIMESTAMP,
                data {json_type} NOT NULL,
                processed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla de FAQs
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS faqs (
                id {id_type},
                question TEXT NOT NULL,
                answer TEXT NOT NULL,
                category TEXT DEFAULT 'general',
                keywords {array_type},
                views INTEGER DEFAULT 0,
                helpful INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Tabla de productos digitales
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS products (
                id {id_type},
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
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS visitors (
                id {id_type},
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
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS notifications (
                id {id_type},
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
        
        # Tabla de analytics - tracking de clics y visitas
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS analytics (
                id {id_type},
                event_type TEXT NOT NULL,
                page_url TEXT,
                element_id TEXT,
                element_text TEXT,
                user_agent TEXT,
                ip_address TEXT,
                country TEXT,
                referrer TEXT,
                utm_source TEXT,
                utm_medium TEXT,
                utm_campaign TEXT,
                session_id TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata {json_type}
            )
        ''')
        
        # Insertar FAQs iniciales
        if is_postgresql:
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
        else:
            # SQLite - insertar sin conflictos
            faqs_data = [
                ('¿Qué plantas medicinales son mejores para el dolor de cabeza?', 
                 'La menta, lavanda y jengibre son especialmente efectivas para dolores de cabeza. La menta contiene mentol que relaja los músculos, la lavanda reduce la tensión y el jengibre tiene propiedades antiinflamatorias.', 
                 'plantas', 
                 'dolor,cabeza,menta,lavanda,jengibre'),
                ('¿Cómo cultivar plantas medicinales en casa?', 
                 'La mayoría de hierbas curativas se pueden cultivar en macetas. Necesitas luz solar, buen drenaje y riego moderado. Plantas como menta, manzanilla, albahaca y orégano son ideales para principiantes.', 
                 'cultivo', 
                 'cultivar,casa,macetas,hierbas'),
                ('¿Es seguro usar plantas medicinales con medicamentos?', 
                 'Algunas plantas pueden interactuar con medicamentos. Por ejemplo, el ginkgo puede aumentar el sangrado con anticoagulantes. Siempre consulta con tu médico antes de combinar plantas con medicamentos.', 
                 'seguridad', 
                 'medicamentos,interacciones,seguro,consulta')
            ]
            cursor.executemany('''
                INSERT OR IGNORE INTO faqs (question, answer, category, keywords) VALUES (?, ?, ?, ?)
            ''', faqs_data)
        
        # Insertar producto inicial
        if is_postgresql:
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
        else:
            cursor.execute('''
                INSERT OR IGNORE INTO products (name, description, price, currency, hotmart_link, category) VALUES
                ('Enciclopedia de Plantas Medicinales', 
                 'Guía completa con más de 550 hierbas medicinales, preparados caseros, cultivo y propiedades terapéuticas', 
                 29.99, 
                 'USD', 
                 'https://go.hotmart.com/H102540942W', 
                 'libros-digitales')
            ''')
        
        conn.commit()
        if is_postgresql:
            print("✅ Base de datos PostgreSQL inicializada correctamente")
        else:
            print("✅ Base de datos SQLite inicializada correctamente")
        print("✅ Tablas creadas: push_subs, hotmart_events, faqs, products, visitors, notifications, analytics")
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

@app.route('/test')
def test():
    """Ruta de prueba"""
    return jsonify({
        'status': 'success',
        'message': 'Aplicación funcionando correctamente',
        'database': 'PostgreSQL',
        'timestamp': datetime.now().isoformat()
    })

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
        
        # Detectar tipo de base de datos
        db_url = os.getenv('DATABASE_URL')
        is_postgresql = db_url and db_url.startswith('postgresql')
        
        # Verificar si ya existe
        if is_postgresql:
            cursor.execute('SELECT id FROM push_subs WHERE endpoint = %s', (endpoint,))
        else:
            cursor.execute('SELECT id FROM push_subs WHERE endpoint = ?', (endpoint,))
        
        if cursor.fetchone():
            return jsonify({'message': 'Ya suscrito'}), 200
        
        # Insertar nueva suscripción
        if is_postgresql:
            cursor.execute('''
                INSERT INTO push_subs (endpoint, p256dh, auth) 
                VALUES (%s, %s, %s)
            ''', (endpoint, p256dh, auth))
        else:
            cursor.execute('''
                INSERT INTO push_subs (endpoint, p256dh, auth) 
                VALUES (?, ?, ?)
            ''', (endpoint, p256dh, auth))
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Suscrito correctamente'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/track', methods=['POST'])
def track_event():
    """Trackear eventos de analytics (clics, visitas, etc.)"""
    try:
        data = request.json
        event_type = data.get('event_type')  # 'click', 'page_view', 'scroll', etc.
        
        if not event_type:
            return jsonify({'error': 'Tipo de evento requerido'}), 400
        
        # Obtener información del request
        user_agent = request.headers.get('User-Agent', '')
        ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
        referrer = request.headers.get('Referer', '')
        
        # Extraer parámetros UTM de la URL
        utm_source = request.args.get('utm_source', '')
        utm_medium = request.args.get('utm_medium', '')
        utm_campaign = request.args.get('utm_campaign', '')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Detectar tipo de base de datos
        db_url = os.getenv('DATABASE_URL')
        is_postgresql = db_url and db_url.startswith('postgresql')
        
        if is_postgresql:
            cursor.execute('''
                INSERT INTO analytics (
                    event_type, page_url, element_id, element_text,
                    user_agent, ip_address, referrer,
                    utm_source, utm_medium, utm_campaign,
                    session_id, metadata
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (
                event_type,
                data.get('page_url'),
                data.get('element_id'),
                data.get('element_text'),
                user_agent,
                ip_address,
                referrer,
                utm_source,
                utm_medium,
                utm_campaign,
                data.get('session_id'),
                json.dumps(data.get('metadata', {}))
            ))
        else:
            # SQLite
            cursor.execute('''
                INSERT INTO analytics (
                    event_type, page_url, element_id, element_text,
                    user_agent, ip_address, referrer,
                    utm_source, utm_medium, utm_campaign,
                    session_id, metadata
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                event_type,
                data.get('page_url'),
                data.get('element_id'),
                data.get('element_text'),
                user_agent,
                ip_address,
                referrer,
                utm_source,
                utm_medium,
                utm_campaign,
                data.get('session_id'),
                json.dumps(data.get('metadata', {}))
            ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/stats', methods=['GET'])
def get_analytics_stats():
    """Obtener estadísticas de analytics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Estadísticas generales
        cursor.execute('''
            SELECT 
                COUNT(*) as total_events,
                COUNT(DISTINCT session_id) as unique_sessions,
                COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) as page_views,
                COUNT(CASE WHEN event_type = 'click' THEN 1 END) as clicks,
                COUNT(CASE WHEN timestamp >= CURRENT_DATE THEN 1 END) as events_today
            FROM analytics
        ''')
        general_stats = cursor.fetchone()
        
        # Páginas más visitadas
        cursor.execute('''
            SELECT page_url, COUNT(*) as visits
            FROM analytics 
            WHERE event_type = 'page_view' AND page_url IS NOT NULL
            GROUP BY page_url
            ORDER BY visits DESC
            LIMIT 10
        ''')
        top_pages = [{'url': row[0], 'visits': row[1]} for row in cursor.fetchall()]
        
        # Elementos más clickeados
        cursor.execute('''
            SELECT element_id, element_text, COUNT(*) as clicks
            FROM analytics 
            WHERE event_type = 'click' AND element_id IS NOT NULL
            GROUP BY element_id, element_text
            ORDER BY clicks DESC
            LIMIT 10
        ''')
        top_clicks = [{'id': row[0], 'text': row[1], 'clicks': row[2]} for row in cursor.fetchall()]
        
        # Estadísticas por día (últimos 7 días)
        cursor.execute('''
            SELECT DATE(timestamp) as date, COUNT(*) as events
            FROM analytics 
            WHERE timestamp >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY DATE(timestamp)
            ORDER BY date DESC
        ''')
        daily_stats = [{'date': row[0].isoformat(), 'events': row[1]} for row in cursor.fetchall()]
        
        conn.close()
        
        return jsonify({
            'general': {
                'total_events': general_stats[0] or 0,
                'unique_sessions': general_stats[1] or 0,
                'page_views': general_stats[2] or 0,
                'clicks': general_stats[3] or 0,
                'events_today': general_stats[4] or 0
            },
            'top_pages': top_pages,
            'top_clicks': top_clicks,
            'daily_stats': daily_stats
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analytics/dashboard', methods=['GET'])
def analytics_dashboard():
    """Dashboard de analytics - página HTML"""
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Analytics Dashboard - Plantas Medicinales</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; }
            .card { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
            .stat-card { text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; }
            .stat-number { font-size: 2em; font-weight: bold; }
            .stat-label { font-size: 0.9em; opacity: 0.9; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f8f9fa; font-weight: bold; }
            .refresh-btn { background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 0; }
            .refresh-btn:hover { background: #218838; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📊 Analytics Dashboard - Plantas Medicinales</h1>
            
            <button class="refresh-btn" onclick="loadStats()">🔄 Actualizar</button>
            
            <div class="card">
                <h2>📈 Estadísticas Generales</h2>
                <div class="stats-grid" id="general-stats">
                    <!-- Se llena con JavaScript -->
                </div>
            </div>
            
            <div class="card">
                <h2>🌐 Páginas Más Visitadas</h2>
                <table id="top-pages">
                    <thead>
                        <tr><th>Página</th><th>Visitas</th></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            
            <div class="card">
                <h2>👆 Elementos Más Clickeados</h2>
                <table id="top-clicks">
                    <thead>
                        <tr><th>Elemento</th><th>Texto</th><th>Clicks</th></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            
            <div class="card">
                <h2>📅 Actividad Últimos 7 Días</h2>
                <table id="daily-stats">
                    <thead>
                        <tr><th>Fecha</th><th>Eventos</th></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        
        <script>
            async function loadStats() {
                try {
                    const response = await fetch('/api/analytics/stats');
                    const data = await response.json();
                    
                    // Estadísticas generales
                    const generalDiv = document.getElementById('general-stats');
                    generalDiv.innerHTML = `
                        <div class="stat-card">
                            <div class="stat-number">${data.general.total_events}</div>
                            <div class="stat-label">Total Eventos</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${data.general.unique_sessions}</div>
                            <div class="stat-label">Sesiones Únicas</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${data.general.page_views}</div>
                            <div class="stat-label">Visitas</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${data.general.clicks}</div>
                            <div class="stat-label">Clicks</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${data.general.events_today}</div>
                            <div class="stat-label">Hoy</div>
                        </div>
                    `;
                    
                    // Top páginas
                    const topPagesTbody = document.querySelector('#top-pages tbody');
                    topPagesTbody.innerHTML = data.top_pages.map(page => 
                        `<tr><td>${page.url}</td><td>${page.visits}</td></tr>`
                    ).join('');
                    
                    // Top clicks
                    const topClicksTbody = document.querySelector('#top-clicks tbody');
                    topClicksTbody.innerHTML = data.top_clicks.map(click => 
                        `<tr><td>${click.id}</td><td>${click.text}</td><td>${click.clicks}</td></tr>`
                    ).join('');
                    
                    // Estadísticas diarias
                    const dailyStatsTbody = document.querySelector('#daily-stats tbody');
                    dailyStatsTbody.innerHTML = data.daily_stats.map(day => 
                        `<tr><td>${day.date}</td><td>${day.events}</td></tr>`
                    ).join('');
                    
                } catch (error) {
                    console.error('Error cargando estadísticas:', error);
                }
            }
            
            // Cargar estadísticas al inicio
            loadStats();
            
            // Actualizar cada 30 segundos
            setInterval(loadStats, 30000);
        </script>
    </body>
    </html>
    '''

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
        
        # Detectar tipo de base de datos
        db_url = os.getenv('DATABASE_URL')
        is_postgresql = db_url and db_url.startswith('postgresql')
        
        # Extraer datos del comprador
        buyer = event_data.get('buyer', {})
        product = event_data.get('product', {})
        transaction = event_data.get('transaction', {})
        
        if is_postgresql:
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
        else:
            # SQLite - usar INSERT OR REPLACE
            cursor.execute('''
                INSERT OR REPLACE INTO hotmart_events (
                    event_type, transaction_id, buyer_email, buyer_name, 
                    buyer_country, product_name, product_price, currency, 
                    purchase_date, data
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    
    # Verificar conexión rápida a PostgreSQL
    print("🔗 Verificando conexión a PostgreSQL...")
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        conn.close()
        print("✅ Conexión a PostgreSQL exitosa")
        
        # Solo inicializar si es necesario
        print("📊 Verificando si necesitamos inicializar tablas...")
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'push_subs')")
        tables_exist = cursor.fetchone()[0]
        conn.close()
        
        if not tables_exist:
            print("📊 Inicializando base de datos PostgreSQL...")
            init_db()
            print("✅ Base de datos PostgreSQL inicializada correctamente")
        else:
            print("✅ Tablas ya existen, saltando inicialización")
            
    except Exception as e:
        print(f"❌ Error conectando a PostgreSQL: {e}")
        print("📊 Intentando inicializar base de datos...")
        try:
            init_db()
            print("✅ Base de datos PostgreSQL inicializada correctamente")
        except Exception as e2:
            print(f"❌ Error crítico: {e2}")
            sys.exit(1)
    
    # Configuración para Railway
    port = int(os.environ.get('PORT', 5000))  # Railway usa puerto 5000 por defecto
    host = '0.0.0.0'  # Siempre escuchar en todas las interfaces
    debug = False  # Siempre modo producción en Railway
    
    print(f"🌐 Configuración del servidor:")
    print(f"   Host: {host}")
    print(f"   Puerto: {port}")
    print(f"   Debug: {debug}")
    print(f"   Variable PORT: {os.environ.get('PORT', 'NO DEFINIDA')}")
    print(f"   Todas las variables de entorno:")
    for key, value in os.environ.items():
        if 'PORT' in key or 'RAILWAY' in key:
            print(f"     {key}: {value}")
    
    # Levantar servidor
    print("🚀 Robot de Ventas Hotmart - Backend Flask")
    print(f"📊 Base de datos: PostgreSQL")
    print(f"🔐 Webhook secret: {'*' * len(HOTMART_SECRET)}")
    print("=" * 60)
    
    app.run(host=host, port=port, debug=debug)