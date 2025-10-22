# Robot de Ventas Hotmart (PWA + Flask + Web Push + Telegram + SEO)

## ¿Qué es este proyecto?

Sistema completo para vender productos digitales de Hotmart sin depender de redes sociales ni anuncios pagos. Combina:

- **PWA (Progressive Web App)**: App instalable con asistente de compra
- **Flask API**: Backend para webhook Hotmart, FAQs y suscripciones Push
- **Web Push (VAPID)**: Notificaciones para cupones/ofertas
- **Bot Telegram**: Catálogo de productos con enlaces directos
- **SEO Técnico**: Páginas long-tail con JSON-LD + sitemap

## Tecnologías

- Python 3.12 + Flask
- HTML5 + JavaScript vanilla (sin frameworks)
- SQLite (migrable a Firebird)
- Web Push API (pywebpush)
- python-telegram-bot

## Variables a configurar

Editar `.env` con tus valores reales:

- `HOTMART_HOTLINK_BASE`: URL de checkout Hotmart (ej: `https://pay.hotmart.com/TU_PRODUCTO`)
- `HOTMART_WEBHOOK_SECRET`: Secreto para validar webhook (genera uno aleatorio)
- `BASE_URL_PUBLICA`: Tu dominio público (ej: `https://tusitio.com`)
- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`: Generar con `python server/push_test.py --gen-keys`
- `TELEGRAM_BOT_TOKEN`: Token de @BotFather

## Instalación en Windows 10/11

### 1. Crear entorno virtual
```powershell
py -3.12 -m venv venv
venv\Scripts\activate
```

### 2. Instalar dependencias
```powershell
pip install -r server/requirements.txt
```

### 3. Configurar variables
```powershell
copy .env.example .env
notepad .env
```

Completar con tus valores reales.

### 4. Inicializar base de datos
```powershell
python server/app.py --initdb
```

### 5. Levantar backend
```powershell
python server/app.py
```

Backend disponible en `http://127.0.0.1:5000`

### 6. Servir frontend (otra terminal)
```powershell
cd site
python -m http.server 8000
```

PWA disponible en `http://127.0.0.1:8000`

**Alternativa**: Servir todo desde Flask (descomenta líneas en `server/app.py`)

### 7. Generar páginas SEO
```powershell
python scripts/build_pages.py
```

Genera `/site/<slug>/index.html` y `/site/sitemap.xml`

### 8. Probar Web Push
```powershell
python server/push_test.py "Nuevo cupón" "Aprovechá 24h"
```

(Primero necesitás suscripciones desde el PWA)

### 9. Bot Telegram
```powershell
python telegram/bot.py
```

## Seguridad

### Webhook Hotmart (producción)

1. Generá un secreto fuerte:
   ```python
   import secrets
   print(secrets.token_urlsafe(32))
   ```

2. Configuralo en Hotmart Dashboard → Webhook → Secret

3. Descomentá la validación HMAC en `server/app.py`:
   ```python
   # Buscar línea:
   # if not verify_signature(request.data, signature, SECRET):
   # Descomentarla para activar verificación
   ```

### Rotación de claves

- **VAPID**: Regenerar keys rotará todas las suscripciones (los usuarios deben re-suscribirse)
- **Webhook Secret**: Actualizar en .env y en Hotmart Dashboard simultáneamente

## SEO - Contenido de calidad

⚠️ **Importante**: Cada página generada debe:
- Resolver una intención de búsqueda específica
- Aportar valor único (no solo cambiar palabras)
- Evitar "scaled content abuse" (penalizado por Google)

Editar `scripts/pages.csv` con contenido original y útil.

## Legal y privacidad

- **Opt-in obligatorio**: Push/Email requieren consentimiento explícito
- **Política de privacidad**: Agregar en `/site/privacidad.html`
- **GDPR/LGPD**: Implementar si aplica (derecho a eliminar datos)

## Migración a Firebird (futuro)

1. Reemplazar SQLite por `fdb` en `requirements.txt`
2. Cambiar conexión en `server/app.py`:
   ```python
   # import fdb
   # conn = fdb.connect(dsn='localhost:/ruta/db.fdb', user='...', password='...')
   ```
3. Adaptar sintaxis SQL (AUTOINCREMENT → GENERATOR/TRIGGER)

## Estructura del proyecto

```
robot-hotmart/
├── .env                     # Variables sensibles (no commitear)
├── .env.example             # Template de variables
├── .gitignore
├── README.md
├── site/                    # Frontend PWA
│   ├── index.html           # Home + asistente
│   ├── main.js              # Lógica PWA + Push
│   ├── sw.js                # Service Worker
│   ├── manifest.webmanifest
│   └── assets/
│       └── icon-192.png
├── server/                  # Backend Flask
│   ├── app.py               # API + Webhook
│   ├── requirements.txt
│   ├── db_init.sql
│   ├── push_test.py
│   └── faqs.json
├── scripts/
│   ├── build_pages.py       # Generador páginas SEO
│   └── pages.csv            # Contenido páginas
└── telegram/
    └── bot.py               # Bot catálogo
```

## Comandos útiles

```powershell
# Ver suscripciones Push en DB
python -c "import sqlite3; c=sqlite3.connect('server/robot.db'); print(c.execute('SELECT * FROM push_subs').fetchall())"

# Ver eventos Hotmart
python -c "import sqlite3; c=sqlite3.connect('server/robot.db'); print(c.execute('SELECT * FROM hotmart_events').fetchall())"

# Probar webhook localmente
curl -X POST http://127.0.0.1:5000/webhook/hotmart -H "Content-Type: application/json" -d "{\"event\":\"PURCHASE_COMPLETE\",\"data\":{\"buyer\":{\"email\":\"test@test.com\"}}}"
```

## Soporte

Para dudas o mejoras, revisar comentarios en el código fuente.

