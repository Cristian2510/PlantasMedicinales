interface PrepHowToProps {
  title: string
  steps: string[]
  tools?: string[]
  tips?: string[]
}

export default function PrepHowTo({ title, steps, tools, tips }: PrepHowToProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": title,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "text": step
    })),
    ...(tools && {
      "tool": tools.map(tool => ({
        "@type": "HowToTool",
        "name": tool
      }))
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Pasos:</h4>
          <ol className="space-y-2">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700 text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        
        {tools && tools.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Herramientas necesarias:</h4>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {tips && tips.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Consejos útiles:</h4>
            <ul className="space-y-1">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <span className="text-green-500 mr-2">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
