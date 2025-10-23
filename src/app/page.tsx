import SEO from '@/components/SEO'
import Link from 'next/link'

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Plantas Medicinales Naturales",
  "url": "https://plantas-medicinales-weld.vercel.app",
  "logo": "https://plantas-medicinales-weld.vercel.app/logo.png",
  "description": "Enciclopedia completa de plantas medicinales con información científica y tradicional",
  "sameAs": [
    "https://go.hotmart.com/H102540942W"
  ]
}

export default function HomePage() {
  return (
    <>
      <SEO
        title="Enciclopedia de Plantas Medicinales: 550+ Hierbas Curativas y Medicina Natural"
        description="Descubre el poder curativo de más de 550 hierbas medicinales con propiedades terapéuticas documentadas científicamente. Preparados caseros, cultivo y medicina natural segura."
        canonical="/"
        keywords="plantas medicinales, hierbas curativas, medicina natural, remedios caseros, cultivo plantas, propiedades medicinales, fitoterapia"
        jsonLd={jsonLdOrganization}
      />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              🌿 Enciclopedia de Plantas Medicinales
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Descubre el poder curativo de más de 550 hierbas medicinales con propiedades 
              terapéuticas documentadas científicamente. Medicina natural segura y efectiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/plantas-medicinales/"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                🌿 Explorar Plantas Medicinales
              </Link>
              <a 
                href="https://go.hotmart.com/H102540942W"
                className="bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
              >
                📚 Ver Enciclopedia Completa
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">550+ Plantas</h3>
              <p className="text-gray-600">
                Desde las más comunes hasta las exóticas. Historia, cultivo, componentes activos y propiedades detalladas.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">🧪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Preparados Caseros</h3>
              <p className="text-gray-600">
                Tés, tinturas, ungüentos, cataplasmas. Recetas paso a paso con fotos e instrucciones claras.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Seguridad</h3>
              <p className="text-gray-600">
                Información crucial sobre contraindicaciones, interacciones medicamentosas y dosis seguras.
              </p>
            </div>
          </div>

          {/* Popular Plants */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Plantas Medicinales Populares
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Manzanilla', uses: ['Digestión', 'Ansiedad', 'Insomnio'], link: '/plantas-medicinales/manzanilla/' },
                { name: 'Menta', uses: ['Digestión', 'Náuseas', 'Dolor de cabeza'], link: '/plantas-medicinales/menta/' },
                { name: 'Jengibre', uses: ['Náuseas', 'Digestión', 'Inflamación'], link: '/plantas-medicinales/jengibre/' },
                { name: 'Lavanda', uses: ['Ansiedad', 'Insomnio', 'Relajación'], link: '/plantas-medicinales/lavanda/' }
              ].map((planta, index) => (
                <Link 
                  key={index}
                  href={planta.link}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{planta.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {planta.uses.map((uso, i) => (
                      <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {uso}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-12 rounded-lg text-center">
            <h2 className="text-3xl font-bold mb-4">¿Listo para descubrir el poder de las plantas?</h2>
            <p className="text-xl mb-8">
              Accede a nuestra enciclopedia completa con más de 550 plantas medicinales, 
              preparados caseros y guías de cultivo.
            </p>
            <a 
              href="https://go.hotmart.com/H102540942W"
              className="inline-block bg-white text-green-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg"
            >
              🌿 Acceder a la Enciclopedia Completa
            </a>
            <p className="mt-6 text-green-100">
              ✅ Garantía de devolución 7 días<br/>
              📧 Acceso inmediato por email<br/>
              🔄 Actualizaciones gratuitas de por vida
            </p>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center text-gray-600">
            <p>&copy; 2025 Plantas Medicinales Naturales. Todos los derechos reservados.</p>
            <p className="mt-2">
              <Link href="/plantas-medicinales/" className="hover:text-gray-800">
                Guía de Plantas Medicinales
              </Link>
              {' | '}
              <a href="mailto:info@plantasmedicinales.com" className="hover:text-gray-800">
                Contacto
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  )
}
