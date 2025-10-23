/**
 * Sistema de Analytics Personalizado
 * Trackea clics, visitas y eventos de interés
 */

class Analytics {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.baseUrl = window.location.origin;
        this.isTracking = true;
        
        // Inicializar tracking
        this.init();
    }
    
    generateSessionId() {
        // Generar ID de sesión único
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
        
        console.log('📊 Analytics inicializado - Session ID:', this.sessionId);
    }
    
    trackPageView() {
        const data = {
            event_type: 'page_view',
            page_url: window.location.href,
            session_id: this.sessionId,
            metadata: {
                title: document.title,
                referrer: document.referrer,
                screen_size: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                user_agent: navigator.userAgent
            }
        };
        
        this.sendEvent(data);
    }
    
    trackClicks() {
        // Trackear clics en botones importantes
        const importantElements = [
            'button', 'a', '.btn', '.cta', '.buy-button', 
            '.purchase', '.checkout', '.subscribe', '.download'
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
            session_id: this.sessionId,
            metadata: {
                tag_name: element.tagName,
                href: element.href || '',
                position: this.getElementPosition(element),
                visible: this.isElementVisible(element)
            }
        };
        
        this.sendEvent(data);
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
            metadata: {
                scroll_percent: percent,
                scroll_position: window.scrollY,
                page_height: document.body.scrollHeight
            }
        };
        
        this.sendEvent(data);
        console.log(`📜 Scroll milestone: ${percent}%`);
    }
    
    trackScrollEvent(percent) {
        const data = {
            event_type: 'scroll',
            page_url: window.location.href,
            session_id: this.sessionId,
            metadata: {
                scroll_percent: percent,
                scroll_position: window.scrollY
            }
        };
        
        this.sendEvent(data);
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
                metadata: {
                    time_seconds: timeOnPage,
                    time_minutes: Math.round(timeOnPage / 60)
                }
            };
            
            this.sendEvent(data);
        }, 30000);
        
        // Trackear cuando el usuario abandona la página
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            
            const data = {
                event_type: 'page_exit',
                page_url: window.location.href,
                session_id: this.sessionId,
                metadata: {
                    time_seconds: timeOnPage,
                    time_minutes: Math.round(timeOnPage / 60)
                }
            };
            
            // Usar sendBeacon para envío confiable al cerrar
            this.sendEventBeacon(data);
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
            metadata: {
                ...metadata,
                custom_event: true
            }
        };
        
        this.sendEvent(data);
        console.log(`🎯 Evento personalizado trackeado: ${eventName}`);
    }
    
    trackConversion(conversionType, value = null) {
        const data = {
            event_type: 'conversion',
            page_url: window.location.href,
            session_id: this.sessionId,
            metadata: {
                conversion_type: conversionType,
                value: value,
                timestamp: new Date().toISOString()
            }
        };
        
        this.sendEvent(data);
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
}

// Inicializar analytics automáticamente
let analytics;
document.addEventListener('DOMContentLoaded', () => {
    analytics = new Analytics();
    
    // Hacer analytics disponible globalmente
    window.analytics = analytics;
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}
