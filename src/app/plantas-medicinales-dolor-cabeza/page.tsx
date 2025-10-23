import SEO from '@/components/SEO';
import TOC from '@/components/TOC';
import Callout from '@/components/Callout';
import CTATracking from '@/components/CTATracking';

export default function PlantasMedicinalesDolorCabeza() {
  const tocItems = [
    { id: 'introduccion', title: 'Introducción', level: 2 },
    { id: 'mejores-plantas', title: 'Mejores Plantas para Dolor de Cabeza', level: 2 },
    { id: 'preparaciones', title: 'Preparaciones Caseras', level: 2 },
    { id: 'precauciones', title: 'Precauciones Importantes', level: 2 },
    { id: 'faq', title: 'Preguntas Frecuentes', level: 2 }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <SEO
        title="Plantas Medicinales para Dolor de Cabeza - Remedios Naturales Efectivos"
        description="Descubre las mejores plantas medicinales para aliviar el dolor de cabeza de forma natural. Menta, lavanda, jengibre y más hierbas curativas con propiedades analgésicas comprobadas."
        canonicalUrl="https://plantas-medicinales-weld.vercel.app/plantas-medicinales-dolor-cabeza"
        keywords="plantas medicinales dolor cabeza, menta dolor cabeza, lavanda migraña, jengibre cefalea, remedios naturales dolor cabeza"
        openGraph={{
          title: "Plantas Medicinales para Dolor de Cabeza - Remedios Naturales",
          description: "Las mejores hierbas curativas para aliviar dolores de cabeza de forma natural y segura.",
          image: "https://plantas-medicinales-weld.vercel.app/og-image-dolor-cabeza.jpg"
        }}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Plantas Medicinales para Dolor de Cabeza - Remedios Naturales Efectivos",
          "description": "Guía completa de plantas medicinales para aliviar dolores de cabeza de forma natural",
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
          Plantas Medicinales para Dolor de Cabeza: Remedios Naturales Efectivos
        </h1>

        <TOC items={tocItems} />

        <section id="introduccion" className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            ¿Por qué usar plantas medicinales para el dolor de cabeza?
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            El dolor de cabeza es una de las dolencias más comunes que afecta a millones de personas en todo el mundo. 
            Las plantas medicinales ofrecen una alternativa natural y segura a los medicamentos convencionales, 
            con menos efectos secundarios y propiedades curativas comprobadas por siglos de uso tradicional.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Estas hierbas curativas no solo alivian el dolor, sino que también tratan las causas subyacentes como 
            la tensión muscular, la inflamación y el estrés, proporcionando un alivio duradero y natural.
          </p>
        </section>

        <section id="mejores-plantas" className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Las Mejores Plantas Medicinales para Dolor de Cabeza
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-3">🌿 Menta (Mentha piperita)</h3>
              <p className="text-gray-700 mb-3">
                La menta es una de las plantas más efectivas para dolores de cabeza tensionales. 
                Su aceite esencial contiene mentol que relaja los músculos y mejora la circulación.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Relaja los músculos del cuello y hombros</li>
                <li>Mejora la circulación sanguínea</li>
                <li>Efecto refrescante y analgésico</li>
                <li>Segura para uso tópico y oral</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-xl font-semibold text-purple-800 mb-3">🌸 Lavanda (Lavandula angustifolia)</h3>
              <p className="text-gray-700 mb-3">
                La lavanda es especialmente efectiva para migrañas y dolores de cabeza por estrés. 
                Sus propiedades relajantes y antiinflamatorias proporcionan alivio natural.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Reduce la tensión y el estrés</li>
                <li>Propiedades antiinflamatorias</li>
                <li>Mejora la calidad del sueño</li>
                <li>Aroma relajante y terapéutico</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <h3 className="text-xl font-semibold text-orange-800 mb-3">🫚 Jengibre (Zingiber officinale)</h3>
              <p className="text-gray-700 mb-3">
                El jengibre es un potente antiinflamatorio natural que puede aliviar dolores de cabeza 
                causados por inflamación y problemas digestivos.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Propiedades antiinflamatorias potentes</li>
                <li>Mejora la circulación</li>
                <li>Alivia náuseas asociadas</li>
                <li>Efecto analgésico natural</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-3">🌿 Manzanilla (Matricaria chamomilla)</h3>
              <p className="text-gray-700 mb-3">
                La manzanilla es conocida por sus propiedades calmantes y relajantes, 
                ideal para dolores de cabeza por tensión y estrés.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Efecto calmante y relajante</li>
                <li>Reduce la ansiedad y tensión</li>
                <li>Propiedades antiinflamatorias</li>
                <li>Segura para uso prolongado</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="preparaciones" className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Preparaciones Caseras Efectivas
          </h2>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🍵 Té de Menta y Lavanda</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Ingredientes:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>1 cucharadita de hojas de menta frescas</li>
                    <li>1 cucharadita de flores de lavanda</li>
                    <li>1 taza de agua hirviendo</li>
                    <li>Miel al gusto</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Preparación:</h4>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Agregar las hierbas al agua hirviendo</li>
                    <li>Dejar reposar 10-15 minutos</li>
                    <li>Colar y endulzar con miel</li>
                    <li>Beber tibio 2-3 veces al día</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🫚 Infusión de Jengibre</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Ingredientes:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>1 cucharadita de jengibre fresco rallado</li>
                    <li>1 taza de agua hirviendo</li>
                    <li>Jugo de limón</li>
                    <li>Miel al gusto</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Preparación:</h4>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Agregar jengibre al agua hirviendo</li>
                    <li>Dejar reposar 5-10 minutos</li>
                    <li>Agregar limón y miel</li>
                    <li>Beber caliente para máximo efecto</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🌿 Compresa de Manzanilla</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Ingredientes:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>2 cucharadas de flores de manzanilla</li>
                    <li>1 taza de agua hirviendo</li>
                    <li>Paño limpio</li>
                    <li>Bolsa de hielo</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Preparación:</h4>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Preparar infusión de manzanilla</li>
                    <li>Mojar paño en la infusión</li>
                    <li>Aplicar en la frente y sienes</li>
                    <li>Repetir cada 15 minutos</li>
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
              Si experimentas dolores de cabeza frecuentes, intensos o acompañados de otros síntomas, 
              consulta con un profesional de la salud. Las plantas medicinales son complementarias, 
              no reemplazan el tratamiento médico necesario.
            </p>
          </Callout>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-3">🚫 Contraindicaciones</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Embarazo y lactancia (consultar médico)</li>
                <li>Alergias conocidas a las plantas</li>
                <li>Interacciones con medicamentos</li>
                <li>Dolores de cabeza crónicos severos</li>
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
            Preguntas Frecuentes sobre Plantas Medicinales para Dolor de Cabeza
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ¿Cuánto tiempo tarda en hacer efecto?
              </h3>
              <p className="text-gray-700">
                Los efectos pueden variar según la persona y el tipo de dolor. Las preparaciones tópicas 
                (como compresas) pueden aliviar en 15-30 minutos, mientras que las infusiones pueden 
                tomar 30-60 minutos en hacer efecto completo.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ¿Puedo usar varias plantas juntas?
              </h3>
              <p className="text-gray-700">
                Sí, muchas plantas medicinales se complementan bien. Por ejemplo, la menta y la lavanda 
                trabajan sinérgicamente para relajar músculos y reducir tensión. Sin embargo, es importante 
                no exceder las dosis recomendadas.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                ¿Son seguras para niños?
              </h3>
              <p className="text-gray-700">
                La mayoría de estas plantas son seguras para niños en dosis reducidas, pero siempre 
                consulta con un pediatra antes de usar cualquier remedio herbal en menores. La manzanilla 
                y la menta suelen ser las más seguras para uso pediátrico.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-lg text-center">
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
            id="cta-enciclopedia-dolor-cabeza"
          >
            Acceder a la Enciclopedia Completa
          </CTATracking>
        </section>
      </article>
    </div>
  );
}
