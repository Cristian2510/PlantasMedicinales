/**
 * Sistema de Analytics Personalizado Mejorado
 * Trackea clics, visitas y eventos de interés con almacenamiento local
 */

class Analytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.baseUrl = window.location.origin;
        this.isTracking = true;
        this.localStorage = this.getLocalStorage();
        
        // Inicializar tracking
        this.init();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getLocalStorage() {
        try {
            return {
                get: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                remove: (key) => localStorage.removeItem(key)
            };
        } catch (e) {
            console.warn('LocalStorage no disponible, usando memoria');
            const memory = {};
            return {
                get: (key) => memory[key] || null,
                set: (key, value) => memory[key] = value,
                remove: (key) => delete memory[key]
            };
        }
    }
    
    init() {
        // Trackear visita de página
        this.trackPageView();
        
        // Trackear clics en elementos importantes
        this.trackClicks();
        
        // Trackear scroll (interés en la página)
        this.trackScroll();
        
        // Trackear tiempo en página
        this.trackTimeOnPage();
        
        // Guardar datos localmente
        this.saveToLocal();
        
        console.log('📊 Analytics inicializado - Session ID:', this.sessionId);
    }
    
    trackPageView() {
        const data = {
            event_type: 'page_view',
            page_url: window.location.href,
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            metadata: {
                title: document.title,
                referrer: document.referrer,
                screen_size: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                user_agent: navigator.userAgent
            }
        };
        
        this.sendEvent(data);
        this.saveEventLocally(data);
    }
    
    trackClicks() {
        // Trackear clics en botones importantes
        const importantElements = [
            'button', 'a', '.btn', '.cta', '.buy-button', 
            '.purchase', '.checkout', '.subscribe', '.download',
            '[data-track]' // Elementos con atributo data-track
        ];
        
        importantElements.forEach(selector => {
            document.addEventListener('click', (e) => {
                const element = e.target.closest(selector);
                if (element) {
                    this.trackClick(element);
                }
            });
        });
    }
    
    trackClick(element) {
        const data = {
            event_type: 'click',
            page_url: window.location.href,
            element_id: element.id || element.className || 'unknown',
            element_text: element.textContent?.trim().substring(0, 100) || '',
            element_href: element.href || '',
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            metadata: {
                tag_name: element.tagName,
                position: this.getElementPosition(element),
                visible: this.isElementVisible(element),
                click_x: e.clientX,
                click_y: e.clientY
            }
        };
        
        this.sendEvent(data);
        this.saveEventLocally(data);
        console.log('👆 Click trackeado:', data.element_text);
    }
    
    trackScroll() {
        let scrollTimeout;
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            // Trackear hitos de scroll importantes
            if (scrollPercent >= 25 && maxScroll < 25) {
                this.trackScrollMilestone(25);
                maxScroll = 25;
            } else if (scrollPercent >= 50 && maxScroll < 50) {
                this.trackScrollMilestone(50);
                maxScroll = 50;
            } else if (scrollPercent >= 75 && maxScroll < 75) {
                this.trackScrollMilestone(75);
                maxScroll = 75;
            } else if (scrollPercent >= 90 && maxScroll < 90) {
                this.trackScrollMilestone(90);
                maxScroll = 90;
            }
            
            scrollTimeout = setTimeout(() => {
                this.trackScrollEvent(scrollPercent);
            }, 1000);
        });
    }
    
    trackScrollMilestone(percent) {
        const data = {
            event_type: 'scroll_milestone',
            page_url: window.location.href,
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            metadata: {
                scroll_percent: percent,
                scroll_position: window.scrollY,
                page_height: document.body.scrollHeight
            }
        };
        
        this.sendEvent(data);
        this.saveEventLocally(data);
        console.log(`📜 Scroll milestone: ${percent}%`);
    }
    
    trackScrollEvent(percent) {
        const data = {
            event_type: 'scroll',
            page_url: window.location.href,
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            metadata: {
                scroll_percent: percent,
                scroll_position: window.scrollY
            }
        };
        
        this.sendEvent(data);
        this.saveEventLocally(data);
    }
    
    trackTimeOnPage() {
        let startTime = Date.now();
        
        // Trackear tiempo cada 30 segundos
        setInterval(() => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            
            const data = {
                event_type: 'time_on_page',
                page_url: window.location.href,
                session_id: this.sessionId,
                timestamp: new Date().toISOString(),
                metadata: {
                    time_seconds: timeOnPage,
                    time_minutes: Math.round(timeOnPage / 60)
                }
            };
            
            this.sendEvent(data);
            this.saveEventLocally(data);
        }, 30000);
        
        // Trackear cuando el usuario abandona la página
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            
            const data = {
                event_type: 'page_exit',
                page_url: window.location.href,
                session_id: this.sessionId,
                timestamp: new Date().toISOString(),
                metadata: {
                    time_seconds: timeOnPage,
                    time_minutes: Math.round(timeOnPage / 60)
                }
            };
            
            // Usar sendBeacon para envío confiable al cerrar
            this.sendEventBeacon(data);
            this.saveEventLocally(data);
        });
    }
    
    // Métodos auxiliares
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: Math.round(rect.left),
            y: Math.round(rect.top),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
        };
    }
    
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && 
               rect.bottom <= window.innerHeight && 
               rect.right <= window.innerWidth;
    }
    
    // Almacenamiento local
    saveEventLocally(event) {
        try {
            const events = this.localStorage.get('analytics_events') || [];
            events.push(event);
            
            // Mantener solo los últimos 1000 eventos
            if (events.length > 1000) {
                events.splice(0, events.length - 1000);
            }
            
            this.localStorage.set('analytics_events', events);
        } catch (e) {
            console.warn('Error guardando evento localmente:', e);
        }
    }
    
    saveToLocal() {
        try {
            const sessionData = {
                sessionId: this.sessionId,
                startTime: new Date().toISOString(),
                pageViews: 1,
                clicks: 0,
                lastActivity: new Date().toISOString()
            };
            
            this.localStorage.set('analytics_session', sessionData);
        } catch (e) {
            console.warn('Error guardando sesión localmente:', e);
        }
    }
    
    // Envío de eventos
    async sendEvent(data) {
        if (!this.isTracking) return;
        
        try {
            const response = await fetch(`${this.baseUrl}/api/analytics/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                console.warn('⚠️ Error enviando evento de analytics:', response.status);
            }
        } catch (error) {
            console.warn('⚠️ Error de red enviando analytics:', error);
        }
    }
    
    sendEventBeacon(data) {
        if (!this.isTracking) return;
        
        try {
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            navigator.sendBeacon(`${this.baseUrl}/api/analytics/track`, blob);
        } catch (error) {
            console.warn('⚠️ Error enviando beacon:', error);
        }
    }
    
    // Métodos públicos para tracking manual
    trackCustomEvent(eventName, metadata = {}) {
        const data = {
            event_type: event_name,
            page_url: window.location.href,
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            metadata: {
                ...metadata,
                custom_event: true
            }
        };
        
        this.sendEvent(data);
        this.saveEventLocally(data);
        console.log(`🎯 Evento personalizado trackeado: ${eventName}`);
    }
    
    trackConversion(conversionType, value = null) {
        const data = {
            event_type: 'conversion',
            page_url: window.location.href,
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            metadata: {
                conversion_type: conversionType,
                value: value,
                timestamp: new Date().toISOString()
            }
        };
        
        this.sendEvent(data);
        this.saveEventLocally(data);
        console.log(`💰 Conversión trackeada: ${conversionType}`, value ? `(${value})` : '');
    }
    
    // Control de tracking
    enableTracking() {
        this.isTracking = true;
        console.log('📊 Analytics habilitado');
    }
    
    disableTracking() {
        this.isTracking = false;
        console.log('📊 Analytics deshabilitado');
    }
    
    // Método para obtener estadísticas locales
    getLocalStats() {
        try {
            const events = this.localStorage.get('analytics_events') || [];
            const session = this.localStorage.get('analytics_session') || {};
            
            return {
                totalEvents: events.length,
                sessionData: session,
                recentEvents: events.slice(-10),
                pageViews: events.filter(e => e.event_type === 'page_view').length,
                clicks: events.filter(e => e.event_type === 'click').length
            };
        } catch (e) {
            console.warn('Error obteniendo estadísticas locales:', e);
            return null;
        }
    }
}

// Inicializar analytics automáticamente
let analytics;
document.addEventListener('DOMContentLoaded', () => {
    analytics = new Analytics();
    
    // Hacer analytics disponible globalmente
    window.analytics = analytics;
    
    // Agregar botón de debug en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const debugBtn = document.createElement('button');
        debugBtn.textContent = '📊 Ver Stats Locales';
        debugBtn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;background:#4CAF50;color:white;border:none;padding:10px;border-radius:5px;cursor:pointer;';
        debugBtn.onclick = () => {
            const stats = analytics.getLocalStats();
            console.log('📊 Estadísticas locales:', stats);
            alert(`Eventos: ${stats.totalEvents}\nClicks: ${stats.clicks}\nVisitas: ${stats.pageViews}`);
        };
        document.body.appendChild(debugBtn);
    }
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}
