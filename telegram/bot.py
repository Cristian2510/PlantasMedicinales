#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bot de Telegram - Catálogo de productos Hotmart
"""

import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes
from dotenv import load_dotenv

load_dotenv()

# Configuración
TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
HOTLINK_BASE = os.getenv('HOTMART_HOTLINK_BASE', 'https://go.hotmart.com/H102540942W')

# Logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# ============================================
# CATÁLOGO DE PRODUCTOS
# ============================================
# Editar aquí para agregar/quitar productos
PRODUCTOS = [
    {
        'nombre': '🌿 Enciclopedia Plantas Medicinales',
        'slug': 'enciclopedia-plantas-medicinales',
        'precio': 'USD 29',
        'descripcion': 'Guía completa con 550+ hierbas y usos medicinales'
    }
]

# ============================================
# HANDLERS
# ============================================

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Comando /start - Mostrar catálogo con botones inline
    """
    user = update.effective_user
    
    mensaje = f"""
¡Hola {user.first_name}! 👋

Soy el Robot de Ventas. Te ayudo a elegir el producto digital perfecto para tu negocio.

🛍️ **Catálogo de Productos:**
"""
    
    # Crear botones inline para cada producto
    keyboard = []
    
    for producto in PRODUCTOS:
        # URL con UTM tracking
        url = f"{HOTLINK_BASE}?utm_source=telegram&utm_medium=bot&utm_campaign=robot&src=telegram-{producto['slug']}"
        
        # Texto del botón
        button_text = f"{producto['nombre']} - {producto['precio']}"
        
        keyboard.append([InlineKeyboardButton(button_text, url=url)])
    
    # Agregar botón de ayuda
    keyboard.append([InlineKeyboardButton("❓ Ayuda", callback_data='ayuda')])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(mensaje, reply_markup=reply_markup, parse_mode='Markdown')

async def ayuda(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Comando /ayuda - Información de soporte
    """
    mensaje = """
🤖 **Robot de Ventas - Ayuda**

**Comandos disponibles:**
/start - Ver catálogo de productos
/ayuda - Ver esta ayuda

**¿Dudas sobre un producto?**
Hacé click en el producto que te interesa y verás toda la info en la página.

**¿Problemas con tu compra?**
Escribinos a: soporte@tusitio.com

**Garantía:**
Todos nuestros productos tienen garantía de 7 días. Si no te gusta, te devolvemos el 100%.

🔒 **Pago seguro:** Procesado por Hotmart (certificado PCI-DSS)
"""
    
    await update.message.reply_text(mensaje, parse_mode='Markdown')

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """
    Manejar errores
    """
    logger.error(f'Error: {context.error}')

# ============================================
# MAIN
# ============================================

def main():
    """
    Iniciar bot
    """
    if not TOKEN or TOKEN == 'tu_token_bot':
        print("❌ Error: TELEGRAM_BOT_TOKEN no configurado en .env")
        print("   Obtené tu token desde @BotFather en Telegram")
        return
    
    # Crear aplicación
    app = Application.builder().token(TOKEN).build()
    
    # Registrar handlers
    app.add_handler(CommandHandler('start', start))
    app.add_handler(CommandHandler('ayuda', ayuda))
    
    # Error handler
    app.add_error_handler(error_handler)
    
    # Iniciar bot
    print("🤖 Robot de Ventas Hotmart - Bot de Telegram")
    print("=" * 60)
    print("✅ Bot iniciado correctamente")
    print("💬 Buscá tu bot en Telegram y escribí /start")
    print("🛑 Presioná Ctrl+C para detener")
    print("=" * 60)
    
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()

