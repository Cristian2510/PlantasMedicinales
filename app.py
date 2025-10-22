#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Robot de Ventas Hotmart - Aplicación Simple
Servidor Flask para páginas de ventas
"""

from flask import Flask, send_from_directory, redirect
import os

app = Flask(__name__)

# Directorio de archivos estáticos
SITE_DIR = os.path.join(os.path.dirname(__file__), 'site')

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
    # Configuración para Railway
    port = int(os.environ.get('PORT', 5000))
    host = '0.0.0.0' if os.environ.get('RAILWAY_ENVIRONMENT') else '127.0.0.1'
    debug = not os.environ.get('RAILWAY_ENVIRONMENT')
    
    print("=" * 60)
    print("🚀 ROBOT DE VENTAS HOTMART")
    print("=" * 60)
    print("")
    print("✅ Servidor iniciado correctamente")
    print(f"🌐 Puerto: {port}")
    print(f"🏠 Host: {host}")
    print(f"🔧 Debug: {debug}")
    print("")
    print("📄 Páginas disponibles:")
    print("   • Home:        http://127.0.0.1:5000/")
    print("   • Ventas:      http://127.0.0.1:5000/ventas")
    print("   • Producto:    http://127.0.0.1:5000/plantas-medicinales")
    print("")
    print("🛑 Presioná Ctrl+C para detener el servidor")
    print("=" * 60)
    print("")
    
    # Levantar servidor
    app.run(
        host=host,
        port=port,
        debug=debug
    )

