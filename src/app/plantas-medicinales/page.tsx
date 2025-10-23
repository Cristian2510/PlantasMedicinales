import SEO from '@/components/SEO'
import TOC from '@/components/TOC'
import Callout from '@/components/Callout'
import PlantCard from '@/components/PlantCard'
import PrepHowTo from '@/components/PrepHowTo'
import plantasData from '@/data/plantas.json'

const tocItems = [
  { id: 'introduccion', title: 'Introducción', level: 1 },
  { id: 'beneficios-limites', title: 'Beneficios y límites', level: 1 },
  { id: 'seguridad', title: 'Seguridad y contraindicaciones', level: 1 },
  { id: 'lista-plantas', title: 'Lista de plantas medicinales', level: 1 },
  { id: 'preparaciones', title: 'Preparaciones base', level: 1 },
  { id: 'faq', title: 'Preguntas frecuentes', level: 1 },
  { id: 'referencias', title: 'Referencias', level: 1 }
]

const faqData = [
  {
    question: "¿Es seguro combinar plantas medicinales con medicamentos?",
    answer: "Algunas plantas pueden interactuar con medicamentos. Por ejemplo, el ginkgo puede aumentar el sangrado con anticoagulantes, y la hierba de San Juan puede reducir la efectividad de anticonceptivos. Siempre consulte con su médico antes de combinar plantas con medicamentos."
  },
  {
    question: "¿Cuánto tiempo tardan en hacer efecto las plantas medicinales?",
    answer: "Depende del tipo de preparado y problema. Los tés medicinales pueden tener efecto inmediato (como la menta para digestión), mientras que las tinturas pueden tardar días o semanas para problemas crónicos. Cada planta tiene tiempos de acción específicos."
  },
  {
    question: "¿Puedo usar plantas medicinales durante el embarazo?",
    answer: "Algunas plantas son seguras (como jengibre para náuseas), pero muchas están contraindicadas. Siempre consulte con su médico antes de usar cualquier planta medicinal durante el embarazo o lactancia."
  },
  {
    question: "¿Las plantas medicinales tienen efectos secundarios?",
    answer: "Sí, aunque generalmente son más leves que los medicamentos químicos. Por ejemplo, la valeriana puede causar somnolencia, y el ginkgo puede causar malestar estomacal. Es importante conocer los posibles efectos secundarios."
  },
  {
    question: "¿Cómo almacenar plantas medicinales para mantener sus propiedades?",
    answer: "Las plantas secas deben guardarse en frascos herméticos, lejos de la luz y humedad. Las tinturas duran años, los tés hasta 2 años. El almacenamiento correcto maximiza la vida útil y potencia de cada planta."
  },
  {
    question: "¿Qué diferencia hay entre medicina natural y fitoterapia?",
    answer: "La medicina natural es un concepto amplio que incluye dietas, ejercicio y estilo de vida. La fitoterapia se enfoca específicamente en el uso terapéutico de plantas medicinales con base científica, dosificación precisa y estudios que respaldan su efectividad."
  }
]

const jsonLdArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Plantas medicinales: guía completa 2025",
  "inLanguage": "es",
  "author": {
    "@type": "Person",
    "name": "Especialistas en Plantas Medicinales"
  },
  "datePublished": "2025-10-22",
  "dateModified": "2025-10-22",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://plantas-medicinales-weld.vercel.app/plantas-medicinales/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Plantas Medicinales Naturales"
  }
}

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
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
    }
  ]
}

export default function PlantasMedicinalesPage() {
  return (
    <>
      <SEO
        title="Plantas medicinales: guía completa 2025 | Enciclopedia Natural"
        description="Descubre más de 50 plantas medicinales con usos, preparaciones y contraindicaciones. Guía completa basada en evidencia científica para medicina natural segura."
        canonical="/plantas-medicinales/"
        keywords="plantas medicinales, hierbas curativas, medicina natural, fitoterapia, remedios caseros, plantas curativas"
        jsonLd={[jsonLdArticle, jsonLdFAQ, jsonLdBreadcrumb]}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar con TOC */}
            <div className="lg:col-span-1">
              <TOC items={tocItems} />
            </div>

            {/* Contenido principal */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-lg shadow-lg p-8">
                <header className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Plantas medicinales: guía completa 2025
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Descubre el poder curativo de más de 50 plantas medicinales con propiedades terapéuticas documentadas científicamente. 
                    Una guía completa para medicina natural segura y efectiva.
                  </p>
                </header>

                {/* Aviso médico */}
                <Callout type="warning" title="Aviso médico importante">
                  La información presentada es educativa y no reemplaza el consejo profesional. 
                  Siempre consulte con un profesional de la salud antes de usar plantas medicinales, 
                  especialmente si toma medicación, está embarazada o tiene condiciones médicas preexistentes.
                </Callout>

                {/* Introducción */}
                <section id="introduccion" className="mb-12">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-6">Introducción</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Las <strong>plantas medicinales</strong> han sido utilizadas durante milenios por diferentes culturas 
                      para tratar y prevenir enfermedades. La fitoterapia moderna combina el conocimiento tradicional 
                      con la investigación científica para ofrecer alternativas naturales basadas en evidencia.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Esta guía presenta más de 50 plantas medicinales con sus usos terapéuticos, métodos de preparación 
                      y precauciones importantes. Cada planta incluye información sobre su nombre científico, 
                      propiedades medicinales y contraindicaciones.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Es fundamental entender que las plantas medicinales, aunque naturales, contienen compuestos 
                      químicos activos que pueden interactuar con medicamentos y causar efectos secundarios. 
                      Por ello, siempre se recomienda consultar con profesionales de la salud.
                    </p>
                  </div>
                </section>

                {/* Beneficios y límites */}
                <section id="beneficios-limites" className="mb-12">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-6">Beneficios y límites</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <h3 className="text-xl font-semibold text-green-800 mb-4">✅ Beneficios</h3>
                      <ul className="space-y-2 text-green-700">
                        <li>• Alternativas naturales a medicamentos químicos</li>
                        <li>• Menos efectos secundarios en muchos casos</li>
                        <li>• Accesibles y económicas</li>
                        <li>• Complemento a tratamientos convencionales</li>
                        <li>• Prevención de enfermedades</li>
                        <li>• Apoyo al sistema inmunológico</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                      <h3 className="text-xl font-semibold text-yellow-800 mb-4">⚠️ Límites</h3>
                      <ul className="space-y-2 text-yellow-700">
                        <li>• No reemplazan tratamientos médicos serios</li>
                        <li>• Pueden interactuar con medicamentos</li>
                        <li>• Efectos variables entre personas</li>
                        <li>• Requieren conocimiento para uso seguro</li>
                        <li>• Algunas pueden ser tóxicas en dosis altas</li>
                        <li>• Calidad variable según fuente</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Seguridad */}
                <section id="seguridad" className="mb-12">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-6">Seguridad y contraindicaciones</h2>
                  <div className="space-y-6">
                    <Callout type="danger" title="Interacciones comunes">
                      <ul className="space-y-1">
                        <li>• <strong>Ginkgo + anticoagulantes:</strong> Aumenta riesgo de sangrado</li>
                        <li>• <strong>Hierba de San Juan + anticonceptivos:</strong> Reduce efectividad</li>
                        <li>• <strong>Valeriana + sedantes:</strong> Potencia efectos sedantes</li>
                        <li>• <strong>Regaliz + hipertensión:</strong> Puede elevar presión arterial</li>
                      </ul>
                    </Callout>
                    
                    <Callout type="warning" title="Embarazo y lactancia">
                      Muchas plantas están contraindicadas durante el embarazo y lactancia. 
                      Siempre consulte con su médico antes de usar cualquier planta medicinal 
                      durante estos períodos.
                    </Callout>
                    
                    <Callout type="info" title="Niños">
                      Los niños requieren dosis menores y algunas plantas están contraindicadas. 
                      Consulte con un pediatra antes de administrar plantas medicinales a menores.
                    </Callout>
                  </div>
                </section>

                {/* Lista de plantas */}
                <section id="lista-plantas" className="mb-12">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-6">Lista de plantas medicinales</h2>
                  <p className="text-gray-600 mb-8">
                    Explora nuestra colección de más de 50 plantas medicinales con información detallada 
                    sobre sus usos, preparaciones y precauciones.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plantasData.map((planta) => (
                      <PlantCard key={planta.id} planta={planta} />
                    ))}
                  </div>
                </section>

                {/* Preparaciones base */}
                <section id="preparaciones" className="mb-12">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-6">Preparaciones base</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PrepHowTo
                      title="Cómo preparar una infusión"
                      steps={[
                        "Calentar 250 ml de agua a aproximadamente 90°C",
                        "Añadir 1-2 cucharaditas de planta seca",
                        "Reposar tapado durante 5-7 minutos",
                        "Colar y beber caliente"
                      ]}
                      tools={["Taza", "Colador", "Cuchara"]}
                      tips={[
                        "No hervir el agua para preservar compuestos volátiles",
                        "Usar agua filtrada para mejor sabor",
                        "Beber inmediatamente para máximo beneficio"
                      ]}
                    />
                    
                    <PrepHowTo
                      title="Cómo preparar una decocción"
                      steps={[
                        "Añadir 1-2 cucharaditas de planta seca a agua fría",
                        "Llevar a ebullición y mantener 10-15 minutos",
                        "Reducir fuego y cocinar a fuego lento",
                        "Colar y beber caliente"
                      ]}
                      tools={["Olla pequeña", "Colador", "Cuchara"]}
                      tips={[
                        "Ideal para raíces, cortezas y partes duras",
                        "Cocinar a fuego lento para extraer compuestos",
                        "No sobrecocinar para evitar pérdida de propiedades"
                      ]}
                    />
                  </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="mb-12">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-6">Preguntas frecuentes</h2>
                  <div className="space-y-6">
                    {faqData.map((faq, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Referencias */}
                <section id="referencias" className="mb-12">
                  <h2 className="text-3xl font-semibold text-gray-900 mb-6">Referencias</h2>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• MedlinePlus - Información sobre hierbas y suplementos</li>
                      <li>• PubMed - Base de datos de investigaciones médicas</li>
                      <li>• Organización Mundial de la Salud - Medicina tradicional</li>
                      <li>• European Medicines Agency - Guías de fitoterapia</li>
                      <li>• National Center for Complementary and Integrative Health</li>
                    </ul>
                    <p className="mt-4 text-sm text-gray-500">
                      Última actualización: 22 de octubre de 2025
                    </p>
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
        </div>
      </div>
    </>
  )
}
