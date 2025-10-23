import Link from 'next/link'

interface Planta {
  id: string
  nombreComun: string
  nombreCientifico: string
  usos: string[]
  preparado: string
  contraindicaciones: string[]
  fuente: string
  descripcion: string
}

interface PlantCardProps {
  planta: Planta
}

export default function PlantCard({ planta }: PlantCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            <Link 
              href={`/plantas-medicinales/${planta.id}`}
              className="hover:text-green-600 transition-colors duration-200"
            >
              {planta.nombreComun}
            </Link>
          </h3>
          <p className="text-sm text-gray-600 italic">{planta.nombreCientifico}</p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          {planta.usos.length} usos
        </span>
      </div>
      
      <p className="text-gray-700 text-sm mb-4 leading-relaxed">
        {planta.descripcion}
      </p>
      
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Usos principales:</h4>
          <div className="flex flex-wrap gap-2">
            {planta.usos.slice(0, 3).map((uso, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {uso}
              </span>
            ))}
            {planta.usos.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{planta.usos.length - 3} más
              </span>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Preparación:</h4>
          <p className="text-sm text-gray-600">{planta.preparado}</p>
        </div>
        
        {planta.contraindicaciones.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Precauciones:</h4>
            <p className="text-sm text-red-600">
              {planta.contraindicaciones.slice(0, 2).join(', ')}
              {planta.contraindicaciones.length > 2 && '...'}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link 
          href={`/plantas-medicinales/${planta.id}`}
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-colors duration-200"
        >
          Ver detalles completos →
        </Link>
      </div>
    </div>
  )
}
