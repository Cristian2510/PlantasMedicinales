'use client';

import { track } from '@vercel/analytics';

export const useAnalytics = () => {
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    // Track con Vercel Analytics
    track(eventName, properties);
    
    // También enviar a nuestro sistema personalizado
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: eventName,
          page_url: window.location.pathname,
          session_id: getSessionId(),
          metadata: properties,
          timestamp: new Date().toISOString()
        })
      }).catch(console.error);
    }
  };

  const trackPageView = (pageName: string) => {
    trackEvent('page_view', { page: pageName });
  };

  const trackClick = (elementId: string, elementText: string, location: string) => {
    trackEvent('click', {
      element_id: elementId,
      element_text: elementText,
      location: location,
      page_url: typeof window !== 'undefined' ? window.location.pathname : ''
    });
  };

  const trackConversion = (conversionType: string, value?: number) => {
    trackEvent('conversion', {
      type: conversionType,
      value: value,
      page_url: typeof window !== 'undefined' ? window.location.pathname : ''
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackConversion
  };
};

// Función auxiliar para obtener session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}
