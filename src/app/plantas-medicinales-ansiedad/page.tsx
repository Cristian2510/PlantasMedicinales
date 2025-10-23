import SEO from '@/components/SEO';
import TOC from '@/components/TOC';
import Callout from '@/components/Callout';
import CTATracking from '@/components/CTATracking';

export default function PlantasMedicinalesAnsiedad() {
  const tocItems = [
    { id: 'introduccion', title: 'Introducción', level: 2 },
    { id: 'mejores-plantas', title: 'Mejores Plantas para Ansiedad', level: 2 },
    { id: 'preparaciones', title: 'Preparaciones Relajantes', level: 2 },
    { id: 'precauciones', title: 'Precauciones Importantes', level: 2 },
    { id: 'faq', title: 'Preguntas Frecuentes', level: 2 }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SEO
        title="Plantas Medicinales para Ansiedad - Remedios Naturales Calmantes"
        description="Descubre las mejores plantas medicinales para reducir la ansiedad de forma natural. Valeriana, pasiflora, manzanilla y más hierbas relajantes con propiedades ansiolíticas comprobadas."
        canonicalUrl="https://plantas-medicinales-weld.vercel.app/plantas-medicinales-ansiedad"
        keywords="plantas medicinales ansiedad, valeriana ansiedad, pasiflora relajante, manzanilla calma, remedios naturales ansiedad"
        openGraph={{
          title: "Plantas Medicinales para Ansiedad - Remedios Naturales Calmantes",
          description: "Las mejores hierbas curativas para reducir la ansiedad y el estrés de forma natural y segura.",
          image: "https://plantas-medicinales-weld.vercel.app/og-image-ansiedad.jpg"
        }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Plantas Medicinales para Ansiedad - Remedios Naturales Calmantes",
          "description": "Guía completa de plantas medicinales para reducir la ansiedad de forma natural",
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

      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Plantas Medicinales para Ansiedad: Remedios Naturales Calmantes
        </h1>

        <TOC items={tocItems} />

        <section id="introduccion" className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            ¿Por qué usar plantas medicinales para la ansiedad?
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            La ansiedad es una respuesta natural del cuerpo al estrés, pero cuando se vuelve crónica puede afectar 
            significativamente la calidad de vida. Las plantas medicinales ofrecen una alternativa natural y segura 
            a los medicamentos ansiolíticos, con menos efectos secundarios y propiedades relajantes comprobadas.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Estas hierbas curativas no solo calman los síntomas de ansiedad, sino que también ayudan a regular 
            el sistema nervioso, mejorar el sueño y promover un estado de relajación natural y duradero.
          </p>
        </section>

        <section id="mejores-plantas" className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Las Mejores Plantas Medicinales para Ansiedad
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-semibold text-purple-800 mb-3">🌿 Valeriana (Valeriana officinalis)</h3>
              <p className="text-gray-700 mb-3">
                La valeriana es conocida como "la aspirina de las hierbas" por su potente efecto relajante. 
                Es especialmente efectiva para reducir la ansiedad y mejorar la calidad del sueño.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Reduce la actividad del sistema nervioso</li>
                <li>Mejora la calidad del sueño</li>
                <li>Efecto sedante suave y natural</li>
                <li>Segura para uso prolongado</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">🌸 Pasiflora (Passiflora incarnata)</h3>
              <p className="text-gray-700 mb-3">
                La pasiflora es una de las plantas más efectivas para la ansiedad leve a moderada. 
                Sus propiedades relajantes actúan directamente sobre el sistema nervioso central.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Calma la mente y reduce el estrés</li>
                <li>Mejora la concentración</li>
                <li>Efecto ansiolítico natural</li>
                <li>No causa somnolencia diurna</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-3">🌿 Manzanilla (Matricaria chamomilla)</h3>
              <p className="text-gray-700 mb-3">
                La manzanilla es una de las hierbas más seguras y efectivas para la ansiedad. 
                Su efecto calmante es suave pero efectivo, ideal para uso diario.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Efecto calmante suave</li>
                <li>Reduce la tensión muscular</li>
                <li>Mejora la digestión</li>
                <li>Segura para niños y adultos</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-xl font-semibold text-yellow-800 mb-3">🌿 Lavanda (Lavandula angustifolia)</h3>
              <p className="text-gray-700 mb-3">
                La lavanda es conocida por sus propiedades relajantes y su aroma terapéutico. 
                Es especialmente efectiva para la ansiedad relacionada con el estrés.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Aroma relajante y terapéutico</li>
                <li>Reduce la presión arterial</li>
                <li>Mejora el estado de ánimo</li>
                <li>Efecto calmante inmediato</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="preparaciones" className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Preparaciones Relajantes Efectivas
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🍵 Té Relajante de Valeriana y Manzanilla</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Ingredientes:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>1 cucharadita de raíz de valeriana</li>
                    <li>1 cucharadita de flores de manzanilla</li>
                    <li>1 taza de agua hirviendo</li>
                    <li>Miel al gusto</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Preparación:</h4>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Agregar las hierbas al agua hirviendo</li>
                    <li>Dejar reposar 15-20 minutos</li>
                    <li>Colar y endulzar con miel</li>
                    <li>Beber 1 hora antes de dormir</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🌸 Infusión de Pasiflora</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Ingredientes:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>2 cucharaditas de hojas de pasiflora</li>
                    <li>1 taza de agua hirviendo</li>
                    <li>Jugo de limón</li>
                    <li>Miel al gusto</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Preparación:</h4>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Agregar pasiflora al agua hirviendo</li>
                    <li>Dejar reposar 10-15 minutos</li>
                    <li>Agregar limón y miel</li>
                    <li>Beber 2-3 veces al día</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🌿 Baño Relajante con Lavanda</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Ingredientes:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>1 taza de flores de lavanda</li>
                    <li>1 taza de sal marina</li>
                    <li>10 gotas de aceite esencial de lavanda</li>
                    <li>Agua tibia</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Preparación:</h4>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Preparar infusión de lavanda</li>
                    <li>Agregar sal marina y aceite esencial</li>
                    <li>Mezclar en el agua del baño</li>
                    <li>Relajarse durante 20-30 minutos</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="precauciones" className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Precauciones Importantes
          </h2>

          <Callout type="warning">
            <h4 className="font-semibold mb-2">⚠️ Consulta Médica</h4>
            <p>
              Si experimentas ansiedad severa o crónica, consulta con un profesional de la salud. 
              Las plantas medicinales son complementarias, no reemplazan el tratamiento médico necesario 
              para trastornos de ansiedad graves.
            </p>
          </Callout>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-3">🚫 Contraindicaciones</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Embarazo y lactancia (consultar médico)</li>
                <li>Interacciones con medicamentos ansiolíticos</li>
                <li>Alergias conocidas a las plantas</li>
                <li>Ansiedad severa o ataques de pánico</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Uso Seguro</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Seguir dosis recomendadas</li>
                <li>Empezar con cantidades pequeñas</li>
                <li>Observar reacciones del cuerpo</li>
                <li>Usar plantas de calidad certificada</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="faq" className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Preguntas Frecuentes sobre Plantas Medicinales para Ansiedad
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ¿Cuánto tiempo tarda en hacer efecto?
              </h3>
              <p className="text-gray-700">
                Los efectos pueden variar según la persona y la planta. La lavanda puede tener efecto inmediato, 
                mientras que la valeriana puede tomar 2-4 semanas para mostrar beneficios completos. 
                La pasiflora suele tener efecto en 30-60 minutos.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ¿Puedo usar varias plantas juntas?
              </h3>
              <p className="text-gray-700">
                Sí, muchas plantas medicinales se complementan bien para la ansiedad. Por ejemplo, 
                la valeriana y la manzanilla trabajan sinérgicamente para promover la relajación y el sueño. 
                Sin embargo, es importante no exceder las dosis recomendadas.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ¿Son seguras para uso prolongado?
              </h3>
              <p className="text-gray-700">
                La mayoría de estas plantas son seguras para uso prolongado cuando se usan correctamente. 
                La manzanilla y la lavanda son especialmente seguras. Sin embargo, es recomendable 
                hacer pausas periódicas y consultar con un profesional si planeas usarlas por más de 3 meses.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Quieres Conocer Más Plantas Medicinales?
          </h2>
          <p className="text-xl mb-6">
            Descubre nuestra enciclopedia completa con más de 550 hierbas medicinales, 
            preparados caseros y propiedades terapéuticas documentadas científicamente.
          </p>
          <CTATracking
            href="https://go.hotmart.com/H102540942W"
            className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
            id="cta-enciclopedia-ansiedad"
          >
            Acceder a la Enciclopedia Completa
          </CTATracking>
        </section>
      </article>
    </div>
  );
}
