-- Robot de Ventas Hotmart - Esquema de Base de Datos

-- Tabla de leads (emails capturados)
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  source TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de suscripciones Web Push
CREATE TABLE IF NOT EXISTS push_subs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de eventos Hotmart (webhook)
CREATE TABLE IF NOT EXISTS hotmart_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT UNIQUE,
  event_type TEXT,
  buyer_email TEXT,
  status TEXT,
  raw_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_push_endpoint ON push_subs(endpoint);
CREATE INDEX IF NOT EXISTS idx_hotmart_event_id ON hotmart_events(event_id);
CREATE INDEX IF NOT EXISTS idx_hotmart_buyer_email ON hotmart_events(buyer_email);

