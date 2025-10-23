#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Push Test - Enviar notificación Web Push a todas las suscripciones
"""

import sys
import os
import json
import sqlite3
from pywebpush import webpush, WebPushException
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.path.join(os.path.dirname(__file__), 'robot.db')
VAPID_PRIVATE_KEY = os.getenv('VAPID_PRIVATE_KEY')
VAPID_PUBLIC_KEY = os.getenv('VAPID_PUBLIC_KEY')
VAPID_CLAIMS = {"sub": "mailto:admin@tusitio.com"}

def get_all_subscriptions():
    """Obtener todas las suscripciones activas"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.execute('SELECT * FROM push_subs')
    subs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return subs

def delete_subscription(sub_id):
    """Eliminar suscripción inválida"""
    conn = sqlite3.connect(DB_PATH)
    conn.execute('DELETE FROM push_subs WHERE id = ?', (sub_id,))
    conn.commit()
    conn.close()
    print(f"  🗑️  Suscripción {sub_id} eliminada (inválida)")

def send_push_notification(title, body):
    """Enviar notificación a todas las suscripciones"""
    
    if not VAPID_PRIVATE_KEY or not VAPID_PUBLIC_KEY:
        print("❌ Error: VAPID_PRIVATE_KEY o VAPID_PUBLIC_KEY no configuradas en .env")
        print("   Generá las claves con: python -m pywebpush generate_vapid_keys")
        sys.exit(1)
    
    if not os.path.exists(DB_PATH):
        print(f"❌ Error: Base de datos no existe: {DB_PATH}")
        print("   Ejecutá primero: python server/app.py --initdb")
        sys.exit(1)
    
    subs = get_all_subscriptions()
    
    if not subs:
        print("⚠️  No hay suscripciones registradas")
        print("   Suscribite desde el PWA primero (botón 'Recibir cupones')")
        return
    
    print(f"📤 Enviando notificación a {len(subs)} suscripciones...")
    print(f"   Título: {title}")
    print(f"   Body: {body}")
    print("=" * 60)
    
    payload = json.dumps({
        'title': title,
        'body': body,
        'url': '/'
    })
    
    success_count = 0
    error_count = 0
    
    for sub in subs:
        try:
            subscription_info = {
                'endpoint': sub['endpoint'],
                'keys': {
                    'p256dh': sub['p256dh'],
                    'auth': sub['auth']
                }
            }
            
            webpush(
                subscription_info=subscription_info,
                data=payload,
                vapid_private_key=VAPID_PRIVATE_KEY,
                vapid_claims=VAPID_CLAIMS
            )
            
            print(f"✅ Enviado a suscripción {sub['id']}")
            success_count += 1
        
        except WebPushException as e:
            error_count += 1
            print(f"❌ Error en suscripción {sub['id']}: {e}")
            
            # Si es 410 (Gone) o 404 (Not Found), eliminar suscripción
            if e.response and e.response.status_code in [410, 404]:
                delete_subscription(sub['id'])
        
        except Exception as e:
            error_count += 1
            print(f"❌ Error inesperado en suscripción {sub['id']}: {e}")
    
    print("=" * 60)
    print(f"✅ Exitosas: {success_count}")
    print(f"❌ Errores: {error_count}")

def generate_vapid_keys():
    """Generar claves VAPID (solo para setup inicial)"""
    print("🔑 Generando claves VAPID...")
    print("=" * 60)
    os.system("python -m pywebpush generate_vapid_keys")
    print("=" * 60)
    print("Copiá estas claves a tu archivo .env:")
    print("VAPID_PUBLIC_KEY=...")
    print("VAPID_PRIVATE_KEY=...")

if __name__ == '__main__':
    # Generar claves VAPID
    if len(sys.argv) > 1 and sys.argv[1] == '--gen-keys':
        generate_vapid_keys()
        sys.exit(0)
    
    # Enviar notificación
    title = sys.argv[1] if len(sys.argv) > 1 else "Nuevo cupón disponible"
    body = sys.argv[2] if len(sys.argv) > 2 else "Aprovechá 24h de descuento exclusivo"
    
    send_push_notification(title, body)

