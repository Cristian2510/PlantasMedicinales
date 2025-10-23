// main.js - Robot de Ventas Hotmart (PWA + Push + Asistente)

// ============================================
// CONFIGURACIÓN (editar según tu .env)
// ============================================
const CONFIG = {
  API_BASE: 'http://127.0.0.1:5000', // Backend Flask
  HOTLINK_BASE: 'https://go.hotmart.com/H102540942W', // ← Tu Hotlink real
  VAPID_PUBLIC_KEY: 'TU_VAPID_PUBLIC_KEY' // Copiar desde .env
};

// ============================================
// REGISTRO SERVICE WORKER
// ============================================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('[PWA] Service Worker registrado:', reg.scope))
    .catch(err => console.error('[PWA] Error al registrar SW:', err));
}

// ============================================
// WEB PUSH - SUSCRIPCIÓN
// ============================================
async function suscribirPush() {
  try {
    // Verificar soporte
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Tu navegador no soporta notificaciones Push');
      return;
    }

    // Pedir permiso
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      alert('Necesitamos tu permiso para enviarte cupones');
      return;
    }

    // Registrar SW (si no está)
    const registration = await navigator.serviceWorker.ready;

    // Suscribirse a Push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY)
    });

    // Enviar suscripción al backend
    const response = await fetch(`${CONFIG.API_BASE}/api/save-sub`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
        auth: arrayBufferToBase64(subscription.getKey('auth'))
      })
    });

    if (response.ok) {
      document.getElementById('push-status').textContent = '✅ ¡Suscripción exitosa! Recibirás cupones exclusivos.';
    } else {
      throw new Error('Error al guardar suscripción');
    }

  } catch (error) {
    console.error('[Push] Error:', error);
    alert('Error al suscribirse. Revisá la consola.');
  }
}

// Helpers para convertir claves VAPID
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// ============================================
// ASISTENTE DE COMPRA (árbol de decisión)
// ============================================
const productos = [
  {
    slug: 'enciclopedia-plantas-medicinales',
    nombre: 'Enciclopedia de Plantas Medicinales',
    descripcion: 'Guía completa con 550+ hierbas y usos medicinales',
    precio: 'USD 29',
    keywords: ['plantas', 'medicinales', 'salud', 'natural', 'remedios', 'hierbas']
  }
];

let paso = 0;
let respuestas = {};

function iniciarAsistente() {
  paso = 0;
  respuestas = {};
  mostrarPregunta();
}

function mostrarPregunta() {
  const container = document.getElementById('asistente-preguntas');
  
  if (paso === 0) {
    container.innerHTML = `
      <h3>¿Qué problema querés resolver?</h3>
      <button onclick="responder('objetivo', 'dolor')" class="btn">💊 Dolores crónicos</button>
      <button onclick="responder('objetivo', 'natural')" class="btn">🌿 Medicina natural</button>
      <button onclick="responder('objetivo', 'aprender')" class="btn">📚 Aprender sobre plantas</button>
      <button onclick="responder('objetivo', 'cultivar')" class="btn">🌱 Cultivar mis propias plantas</button>
    `;
  } else if (paso === 1) {
    container.innerHTML = `
      <h3>¿Para vos o tu familia?</h3>
      <button onclick="responder('rol', 'personal')" class="btn">👤 Uso personal</button>
      <button onclick="responder('rol', 'familia')" class="btn">👨‍👩‍👧‍👦 Toda la familia</button>
      <button onclick="responder('rol', 'profesional')" class="btn">💼 Uso profesional</button>
    `;
  } else {
    mostrarRecomendacion();
  }
}

function responder(clave, valor) {
  respuestas[clave] = valor;
  paso++;
  mostrarPregunta();
}

function mostrarRecomendacion() {
  // Solo tenemos un producto
  let recomendado = productos[0];
  
  // Personalizar mensaje según respuestas
  let mensaje = '';
  if (respuestas.objetivo === 'dolor') {
    mensaje = 'Perfecto para tratar dolores de cabeza, artritis y problemas comunes sin efectos secundarios.';
  } else if (respuestas.objetivo === 'natural') {
    mensaje = 'La mejor guía para comenzar con medicina natural basada en evidencia científica.';
  } else if (respuestas.objetivo === 'aprender') {
    mensaje = 'Más de 550 plantas explicadas en detalle: historia, cultivo, propiedades y usos.';
  } else if (respuestas.objetivo === 'cultivar') {
    mensaje = 'Incluye calendario de cosecha y guía completa de cultivo para cada planta.';
  } else {
    mensaje = recomendado.descripcion;
  }

  // Redirigir a página de ventas completa
  const ventasUrl = `/ventas?utm_source=pwa&utm_medium=assistant&utm_campaign=robot&src=${recomendado.slug}`;

  document.getElementById('asistente-preguntas').innerHTML = `
    <div class="recomendacion">
      <h3>✨ Esto es perfecto para vos</h3>
      <h2>${recomendado.nombre}</h2>
      <p>${mensaje}</p>
      <p class="precio">${recomendado.precio}</p>
      <a href="${ventasUrl}" class="btn btn-primary">📖 Ver Detalles y Comprar</a>
      <button onclick="iniciarAsistente()" class="btn btn-secondary">🔄 Volver a empezar</button>
    </div>
  `;
}

// ============================================
// FAQ - BUSCADOR
// ============================================
async function buscarFAQ() {
  const query = document.getElementById('faq-input').value.trim();
  if (!query) return;

  try {
    const response = await fetch(`${CONFIG.API_BASE}/qa?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    const container = document.getElementById('faq-resultado');
    if (data.q && data.a) {
      container.innerHTML = `
        <div class="faq-item">
          <strong>P: ${data.q}</strong>
          <p>R: ${data.a}</p>
        </div>
      `;
    } else {
      container.innerHTML = '<p>No encontramos una respuesta. Contactanos por Telegram.</p>';
    }
  } catch (error) {
    console.error('[FAQ] Error:', error);
    document.getElementById('faq-resultado').innerHTML = '<p>Error al buscar. Intentá de nuevo.</p>';
  }
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si ya está instalado
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('[PWA] App instalada');
  }

  // Iniciar asistente automáticamente
  iniciarAsistente();
});

