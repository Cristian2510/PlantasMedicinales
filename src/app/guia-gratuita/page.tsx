import SEO from '@/components/SEO';
import CTATracking from '@/components/CTATracking';

export default function GuiaGratuita() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SEO
        title="Guía Gratuita: 10 Plantas Medicinales Esenciales para tu Hogar"
        description="Descarga gratis nuestra guía completa con las 10 plantas medicinales más importantes, sus propiedades curativas y preparados caseros efectivos."
        canonicalUrl="https://plantas-medicinales-weld.vercel.app/guia-gratuita"
        keywords="guía plantas medicinales gratis, plantas curativas hogar, remedios naturales caseros, hierbas medicinales esenciales"
        openGraph={{
          title: "Guía Gratuita: 10 Plantas Medicinales Esenciales",
          description: "Descarga gratis nuestra guía completa con las plantas medicinales más importantes para tu hogar.",
          image: "https://plantas-medicinales-weld.vercel.app/og-image-guia-gratuita.jpg"
        }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Guía Gratuita: 10 Plantas Medicinales Esenciales para tu Hogar",
          "description": "Guía completa con las plantas medicinales más importantes para el hogar",
          "author": {
            "@type": "Person",
            "name": "Especialistas en Plantas Medicinales"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Plantas Medicinales Naturales"
          },
          "datePublished": "2025-01-22",
          "dateModified": "2025-01-22"
        }}
      />

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🌿 Guía Gratuita: 10 Plantas Medicinales Esenciales
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          Descarga gratis nuestra guía completa con las plantas medicinales más importantes para tu hogar, 
          sus propiedades curativas y preparados caseros efectivos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg border border-green-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📚 ¿Qué incluye esta guía?
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✅</span>
              <span>10 plantas medicinales esenciales para el hogar</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✅</span>
              <span>Propiedades curativas de cada planta</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✅</span>
              <span>Preparados caseros paso a paso</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✅</span>
              <span>Dosis recomendadas y precauciones</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✅</span>
              <span>Consejos de cultivo y conservación</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✅</span>
              <span>Recetas de tés e infusiones</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg border">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎁 Descarga Gratuita
          </h2>
          <p className="text-gray-700 mb-6">
            Completa el formulario y recibe instantáneamente tu guía en PDF 
            con más de 50 páginas de información valiosa.
          </p>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tu nombre completo"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="interes" className="block text-sm font-medium text-gray-700 mb-1">
                Tu principal interés
              </label>
              <select
                id="interes"
                name="interes"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Selecciona una opción</option>
                <option value="dolor">Aliviar dolores</option>
                <option value="ansiedad">Reducir ansiedad</option>
                <option value="digestion">Mejorar digestión</option>
                <option value="sueno">Mejorar sueño</option>
                <option value="inflamacion">Reducir inflamación</option>
                <option value="general">Conocimiento general</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              📥 Descargar Guía Gratuita
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            Al descargar aceptas recibir emails con tips de plantas medicinales. 
            Puedes cancelar en cualquier momento.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          🌟 Testimonios de Nuestros Lectores
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">
              "Esta guía me cambió la vida. Ahora tengo mi propio botiquín natural en casa 
              y he reducido significativamente el uso de medicamentos químicos."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                M
              </div>
              <div>
                <p className="font-semibold text-gray-800">María González</p>
                <p className="text-sm text-gray-600">Madre de familia</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">
              "Las recetas son fáciles de seguir y los resultados son increíbles. 
              Mi familia está más sana y natural que nunca."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                C
              </div>
              <div>
                <p className="font-semibold text-gray-800">Carlos Ruiz</p>
                <p className="text-sm text-gray-600">Emprendedor</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700 mb-4">
              "Como profesional de la salud, recomiendo esta guía a todos mis pacientes. 
              Es información científica y práctica."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                A
              </div>
              <div>
                <p className="font-semibold text-gray-800">Ana Martínez</p>
                <p className="text-sm text-gray-600">Nutricionista</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">
          ¿Quieres Conocer Más Plantas Medicinales?
        </h2>
        <p className="text-xl mb-6">
          Descubre nuestra enciclopedia completa con más de 550 hierbas medicinales, 
          preparados caseros y propiedades terapéuticas documentadas científicamente.
        </p>
        <CTATracking
          href="https://go.hotmart.com/H102540942W"
          className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
          id="cta-enciclopedia-guia"
        >
          Acceder a la Enciclopedia Completa
        </CTATracking>
      </div>
    </div>
  );
}
