interface CalloutProps {
  type: 'warning' | 'tip' | 'info' | 'danger'
  children: React.ReactNode
  title?: string
}

export default function Callout({ type, children, title }: CalloutProps) {
  const styles = {
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: '⚠️',
      title: title || 'Advertencia'
    },
    tip: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: '💡',
      title: title || 'Consejo'
    },
    info: {
      container: 'bg-gray-50 border-gray-200 text-gray-800',
      icon: 'ℹ️',
      title: title || 'Información'
    },
    danger: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: '🚨',
      title: title || 'Precaución'
    }
  }

  const style = styles[type]

  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${style.container}`}>
      <div className="flex items-start">
        <span className="text-lg mr-3 flex-shrink-0">{style.icon}</span>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-2">{style.title}</h4>
          )}
          <div className="text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
