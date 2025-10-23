import SEO from '@/components/SEO'
import Callout from '@/components/Callout'
import PrepHowTo from '@/components/PrepHowTo'
import Link from 'next/link'

const plantasDolorCabeza = [
  {
    nombre: "Menta",
    cientifico: "Mentha piperita",
    preparacion: "Infusión: 1 cucharadita por taza, reposar 3-5 minutos",
    beneficios: "Contiene mentol que relaja los músculos tensos y mejora la circulación",
    contraindicaciones: ["Reflujo gastroesofágico", "Niños menores de 2 años"]
  },
  {
    nombre: "Lavanda",
    cientifico: "Lavandula angustifolia",
    preparacion: "Infusión: 1-2 cucharaditas por taza, reposar 5 minutos",
    beneficios: "Propiedades relajantes que reducen la tensión y el estrés",
    contraindicaciones: ["Alergia a lavanda", "Uso excesivo puede causar somnolencia"]
  },
  {
    nombre: "Jengibre",
    cientifico: "Zingiber officinale",
    preparacion: "Té: 1-2 cm de raíz fresca por taza, hervir 10 minutos",
    beneficios: "Antiinflamatorio natural que reduce la inflamación vascular",
    contraindicaciones: ["Medicamentos anticoagulantes", "Cálculos biliares"]
  },
  {
    nombre: "Manzanilla",
    cientifico: "Matricaria chamomilla",
    preparacion: "Infusión: 1-2 cucharaditas por taza, reposar 5-7 minutos",
    beneficios: "Relajante suave que ayuda con dolores de cabeza por tensión",
    contraindicaciones: ["Alergia a asteráceas", "Embarazo avanzado"]
  },
  {
    nombre: "Romero",
    cientifico: "Rosmarinus officinalis",
    preparacion: "Infusión: 1-2 cucharaditas por taza, reposar 5-10 minutos",
    beneficios: "Mejora la circulación cerebral y tiene propiedades analgésicas",
    contraindicaciones: ["Embarazo", "Epilepsia", "Presión arterial alta"]
  }
]

const jsonLdArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Plantas medicinales para dolor de cabeza: remedios naturales efectivos",
  "inLanguage": "es",
  "author": {
    "@type": "Person",
    "name": "Especialistas en Plantas Medicinales"
  },
  "datePublished": "2025-10-22",
  "dateModified": "2025-10-22",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://plantas-medicinales-weld.vercel.app/plantas-medicinales-dolor-cabeza/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Plantas Medicinales Naturales"
  }
}

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué plantas medicinales son mejores para el dolor de cabeza?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las plantas más efectivas para dolores de cabeza son la menta (por su contenido de mentol), lavanda (por sus propiedades relajantes), jengibre (antiinflamatorio), manzanilla (relajante suave) y romero (mejora circulación cerebral)."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto tiempo tardan en hacer efecto las plantas para dolor de cabeza?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los efectos pueden variar: la menta puede aliviar en 15-30 minutos, la lavanda en 20-45 minutos, y el jengibre en 30-60 minutos. Los efectos dependen del tipo de dolor de cabeza y la sensibilidad individual."
      }
    },
    {
      "@type": "Question",
      "name": "¿Puedo usar plantas medicinales si tomo medicamentos para migraña?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Algunas plantas pueden interactuar con medicamentos. Por ejemplo, el jengibre puede aumentar el efecto de anticoagulantes. Siempre consulte con su médico antes de combinar plantas con medicamentos para migraña."
      }
    }
  ]
}

export default function PlantasDolorCabezaPage() {
  return (
    <>
      <SEO
        title="Plantas medicinales para dolor de cabeza: 5 remedios naturales efectivos"
        description="Descubre las mejores plantas medicinales para aliviar dolores de cabeza: menta, lavanda, jengibre, manzanilla y romero. Preparaciones caseras y precauciones."
        canonical="/plantas-medicinales-dolor-cabeza/"
        keywords="plantas medicinales dolor de cabeza, remedios naturales migraña, menta dolor cabeza, lavanda cefalea, jengibre migraña"
        jsonLd={[jsonLdArticle, jsonLdFAQ]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="bg-white rounded-lg shadow-lg p-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li><Link href="/" className="hover:text-gray-700">Inicio</Link></li>
                <li>→</li>
                <li><Link href="/plantas-medicinales/" className="hover:text-gray-700">Plantas Medicinales</Link></li>
                <li>→</li>
                <li className="text-gray-900 font-medium">Dolor de Cabeza</li>
              </ol>
            </nav>

            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Plantas medicinales para dolor de cabeza: remedios naturales efectivos
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Descubre las 5 plantas medicinales más efectivas para aliviar dolores de cabeza y migrañas 
                de forma natural, con preparaciones caseras seguras y precauciones importantes.
              </p>
            </header>

            {/* Aviso médico */}
            <Callout type="warning" title="Aviso médico importante">
              La información presentada es educativa y no reemplaza el consejo profesional. 
              Si tiene dolores de cabeza frecuentes o severos, consulte con un médico. 
              Siempre consulte antes de usar plantas medicinales si toma medicación.
            </Callout>

            {/* Introducción */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">¿Por qué usar plantas medicinales para dolor de cabeza?</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Los dolores de cabeza son una de las afecciones más comunes, afectando a millones de personas. 
                  Las plantas medicinales ofrecen alternativas naturales que pueden ser efectivas para diferentes 
                  tipos de cefaleas, desde dolores de cabeza por tensión hasta migrañas leves.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Las plantas medicinales actúan de diferentes maneras: algunas relajan los músculos tensos, 
                  otras mejoran la circulación cerebral, y algunas tienen propiedades antiinflamatorias 
                  que reducen la inflamación vascular asociada con las migrañas.
                </p>
              </div>
            </section>

            {/* Plantas específicas */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">5 plantas medicinales más efectivas para dolor de cabeza</h2>
              <div className="space-y-6">
                {plantasDolorCabeza.map((planta, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{planta.nombre}</h3>
                        <p className="text-gray-600 italic">{planta.cientifico}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Beneficios:</h4>
                        <p className="text-gray-700 text-sm">{planta.beneficios}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Preparación:</h4>
                        <p className="text-gray-700 text-sm">{planta.preparacion}</p>
                      </div>
                    </div>
                    
                    {planta.contraindicaciones.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Precauciones:</h4>
                        <p className="text-red-600 text-sm">
                          {planta.contraindicaciones.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Preparaciones detalladas */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Preparaciones caseras efectivas</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PrepHowTo
                  title="Té de menta para dolor de cabeza"
                  steps={[
                    "Calentar 250 ml de agua a 80-85°C (no hervir)",
                    "Añadir 1 cucharadita de hojas de menta secas",
                    "Reposar tapado durante 3-5 minutos",
                    "Colar y beber caliente",
                    "Repetir cada 2-3 horas si es necesario"
                  ]}
                  tools={["Taza", "Colador", "Cuchara", "Tapa"]
                  tips={[
                    "No hervir para preservar el mentol",
                    "Beber inmediatamente para máximo efecto",
                    "Puede combinarse con un poco de miel"
                  ]}
                />
                
                <PrepHowTo
                  title="Compresa de lavanda para migraña"
                  steps={[
                    "Preparar infusión concentrada de lavanda",
                    "Empapar una toalla pequeña en la infusión",
                    "Aplicar sobre la frente y sienes",
                    "Mantener durante 15-20 minutos",
                    "Repetir cada hora si es necesario"
                  ]}
                  tools={["Toalla pequeña", "Tazón", "Lavanda seca"]
                  tips={[
                    "Usar agua tibia, no caliente",
                    "Añadir 2-3 gotas de aceite esencial de lavanda",
                    "Relajarse en un ambiente tranquilo"
                  ]}
                />
              </div>
            </section>

            {/* Tipos de dolor de cabeza */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tipos de dolor de cabeza y plantas recomendadas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Dolor de cabeza por tensión</h3>
                  <p className="text-blue-800 mb-3">Causado por tensión muscular en cuello y hombros.</p>
                  <ul className="text-blue-700 space-y-1">
                    <li>• <strong>Menta:</strong> Relaja músculos tensos</li>
                    <li>• <strong>Lavanda:</strong> Reduce estrés y tensión</li>
                    <li>• <strong>Manzanilla:</strong> Relajante suave</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Migraña</h3>
                  <p className="text-green-800 mb-3">Dolor pulsátil intenso, a menudo con náuseas.</p>
                  <ul className="text-green-700 space-y-1">
                    <li>• <strong>Jengibre:</strong> Antiinflamatorio y anti-náuseas</li>
                    <li>• <strong>Romero:</strong> Mejora circulación cerebral</li>
                    <li>• <strong>Menta:</strong> Efecto refrescante</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Preguntas frecuentes</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">¿Qué plantas medicinales son mejores para el dolor de cabeza?</h3>
                  <p className="text-gray-700">Las plantas más efectivas para dolores de cabeza son la menta (por su contenido de mentol), lavanda (por sus propiedades relajantes), jengibre (antiinflamatorio), manzanilla (relajante suave) y romero (mejora circulación cerebral).</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">¿Cuánto tiempo tardan en hacer efecto las plantas para dolor de cabeza?</h3>
                  <p className="text-gray-700">Los efectos pueden variar: la menta puede aliviar en 15-30 minutos, la lavanda en 20-45 minutos, y el jengibre en 30-60 minutos. Los efectos dependen del tipo de dolor de cabeza y la sensibilidad individual.</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">¿Puedo usar plantas medicinales si tomo medicamentos para migraña?</h3>
                  <p className="text-gray-700">Algunas plantas pueden interactuar con medicamentos. Por ejemplo, el jengibre puede aumentar el efecto de anticoagulantes. Siempre consulte con su médico antes de combinar plantas con medicamentos para migraña.</p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">¿Quieres aprender más sobre plantas medicinales?</h3>
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
