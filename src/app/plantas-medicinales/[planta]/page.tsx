import { notFound } from 'next/navigation'
import SEO from '@/components/SEO'
import Callout from '@/components/Callout'
import plantasData from '@/data/plantas.json'

interface PlantaPageProps {
  params: {
    planta: string
  }
}

export async function generateStaticParams() {
  return plantasData.map((planta) => ({
    planta: planta.id
  }))
}

export default function PlantaPage({ params }: PlantaPageProps) {
  const planta = plantasData.find(p => p.id === params.planta)
  
  if (!planta) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${planta.nombreComun}: propiedades y usos medicinales`,
    "inLanguage": "es",
    "author": {
      "@type": "Person",
      "name": "Especialistas en Plantas Medicinales"
    },
    "datePublished": "2025-10-22",
    "dateModified": "2025-10-22",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://plantas-medicinales-weld.vercel.app/plantas-medicinales/${planta.id}/`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Plantas Medicinales Naturales"
    }
  }

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://plantas-medicinales-weld.vercel.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Plantas Medicinales",
        "item": "https://plantas-medicinales-weld.vercel.app/plantas-medicinales/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": planta.nombreComun,
        "item": `https://plantas-medicinales-weld.vercel.app/plantas-medicinales/${planta.id}/`
      }
    ]
  }

  return (
    <>
      <SEO
        title={`${planta.nombreComun} (${planta.nombreCientifico}): propiedades y usos medicinales`}
        description={`Descubre las propiedades medicinales de ${planta.nombreComun}. Usos: ${planta.usos.slice(0, 3).join(', ')}. Preparación: ${planta.preparado}`}
        canonical={`/plantas-medicinales/${planta.id}/`}
        keywords={`${planta.nombreComun}, ${planta.nombreCientifico}, plantas medicinales, hierbas curativas, medicina natural`}
        jsonLd={[jsonLd, jsonLdBreadcrumb]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="bg-white rounded-lg shadow-lg p-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li><a href="/" className="hover:text-gray-700">Inicio</a></li>
                <li>→</li>
                <li><a href="/plantas-medicinales/" className="hover:text-gray-700">Plantas Medicinales</a></li>
                <li>→</li>
                <li className="text-gray-900 font-medium">{planta.nombreComun}</li>
              </ol>
            </nav>

            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {planta.nombreComun}
              </h1>
              <p className="text-xl text-gray-600 italic mb-4">
                {planta.nombreCientifico}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {planta.descripcion}
              </p>
            </header>

            {/* Aviso médico */}
            <Callout type="warning" title="Aviso médico importante">
              La información presentada es educativa y no reemplaza el consejo profesional. 
              Siempre consulte con un profesional de la salud antes de usar esta planta, 
              especialmente si toma medicación o tiene condiciones médicas preexistentes.
            </Callout>

            {/* Usos principales */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Usos principales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planta.usos.map((uso, index) => (
                  <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <span className="text-green-600 mr-3">✓</span>
                      <span className="text-green-800 font-medium">{uso}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Preparación */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Preparación</h2>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Método recomendado:</h3>
                <p className="text-blue-800 leading-relaxed">{planta.preparado}</p>
              </div>
            </section>

            {/* Contraindicaciones */}
            {planta.contraindicaciones.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Precauciones y contraindicaciones</h2>
                <Callout type="danger" title="Importante">
                  <ul className="space-y-2">
                    {planta.contraindicaciones.map((contra, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span>{contra}</span>
                      </li>
                    ))}
                  </ul>
                </Callout>
              </section>
            )}

            {/* Información adicional */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Información adicional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Nombre científico</h3>
                  <p className="text-gray-700 italic">{planta.nombreCientifico}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Fuente de información</h3>
                  <a 
                    href={planta.fuente} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Ver fuente científica
                  </a>
                </div>
              </div>
            </section>

            {/* Navegación */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Más plantas medicinales</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plantasData
                  .filter(p => p.id !== planta.id)
                  .slice(0, 3)
                  .map((otraPlanta) => (
                    <a 
                      key={otraPlanta.id}
                      href={`/plantas-medicinales/${otraPlanta.id}/`}
                      className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">{otraPlanta.nombreComun}</h3>
                      <p className="text-sm text-gray-600 italic">{otraPlanta.nombreCientifico}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {otraPlanta.usos.slice(0, 2).join(', ')}
                      </p>
                    </a>
                  ))}
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">¿Quieres aprender más?</h3>
              <p className="text-lg mb-6">
                Descubre nuestra enciclopedia completa con más de 550 plantas medicinales, 
                preparados caseros y guías de cultivo.
              </p>
              <a 
                href="https://go.hotmart.com/H102540942W"
                className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Ver Enciclopedia Completa
              </a>
            </div>
          </article>
        </div>
      </div>
    </>
  )
}
