'use client';

import { useEffect } from 'react';
import { CTATracking } from '@/components/CTATracking';
import { useAnalytics } from '@/hooks/useAnalytics';
import LeadCaptureForm from '@/components/LeadCaptureForm';

export default function Home() {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('home');
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            🌿 Plantas Medicinales
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Descubre el poder curativo de la naturaleza con nuestra enciclopedia completa de plantas medicinales
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              📚 Enciclopedia Completa
            </h2>
            <p className="text-gray-700 mb-6">
              Más de 550 plantas medicinales con propiedades terapéuticas documentadas científicamente.
            </p>
            <CTATracking
              elementId="enciclopedia-cta"
              elementText="Ver Enciclopedia Completa"
              location="home-hero"
              href="/plantas-medicinales"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🌿 Ver Enciclopedia Completa
            </CTATracking>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              🧠 Conocimiento Científico
            </h2>
            <p className="text-gray-700 mb-6">
              Información basada en estudios científicos y tradición ancestral para uso seguro y efectivo.
            </p>
            <CTATracking
              elementId="dolor-cabeza-cta"
              elementText="Plantas para Dolor de Cabeza"
              location="home-hero"
              href="/plantas-medicinales-dolor-cabeza"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🧠 Plantas para Dolor de Cabeza
            </CTATracking>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              📚 Enciclopedia Completa
            </h2>
            <p className="text-gray-700 mb-6">
              Más de 550 plantas medicinales con propiedades terapéuticas documentadas científicamente.
            </p>
            <CTATracking
              elementId="enciclopedia-cta"
              elementText="Ver Enciclopedia Completa"
              location="home-hero"
              href="/plantas-medicinales"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🌿 Ver Enciclopedia Completa
            </CTATracking>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              🧠 Conocimiento Científico
            </h2>
            <p className="text-gray-700 mb-6">
              Información basada en estudios científicos y tradición ancestral para uso seguro y efectivo.
            </p>
            <CTATracking
              elementId="dolor-cabeza-cta"
              elementText="Plantas para Dolor de Cabeza"
              location="home-hero"
              href="/plantas-medicinales-dolor-cabeza"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🧠 Plantas para Dolor de Cabeza
            </CTATracking>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">
              🎁 Guía Gratuita
            </h2>
            <p className="text-gray-700 mb-6">
              Descarga gratis nuestra guía con las 10 plantas medicinales más importantes para tu hogar.
            </p>
            <CTATracking
              elementId="guia-gratuita-cta"
              elementText="Descargar Guía Gratuita"
              location="home-hero"
              href="/guia-gratuita"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              📥 Descargar Guía Gratuita
            </CTATracking>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🎁 Descarga Gratuita: Guía de Plantas Medicinales Esenciales
          </h2>
          <div className="max-w-2xl mx-auto">
            <LeadCaptureForm
              title="Guía Gratuita: 10 Plantas Medicinales Esenciales"
              description="Recibe instantáneamente nuestra guía completa con las plantas medicinales más importantes para tu hogar, sus propiedades curativas y preparados caseros efectivos."
              buttonText="Descargar Guía Gratuita"
            />
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            ¿Listo para descubrir el poder de las plantas medicinales?
          </h3>
          <CTATracking
            elementId="hotmart-cta"
            elementText="Comprar Enciclopedia Completa"
            location="home-bottom"
            href="https://go.hotmart.com/H102540942W?utm_source=web&utm_medium=home&utm_campaign=plantas"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
          >
            🌿 Comprar Enciclopedia Completa
          </CTATracking>
        </div>

      </div>
    </div>
  );
}
