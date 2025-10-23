'use client';

import { useState } from 'react';
import CTATracking from './CTATracking';

interface LeadCaptureFormProps {
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
}

export default function LeadCaptureForm({ 
  title = "Descarga Gratuita",
  description = "Recibe nuestra guía completa de plantas medicinales",
  buttonText = "Descargar Ahora",
  className = ""
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    interes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí iría la lógica real de envío a tu backend
      console.log('Formulario enviado:', formData);
      
      setIsSuccess(true);
      
      // Track del evento de conversión
      if (typeof window !== 'undefined') {
        // Enviar evento a analytics
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'lead_capture',
            page_url: window.location.href,
            element_id: 'lead-form',
            element_text: 'Formulario de descarga',
            metadata: {
              form_type: 'guia_gratuita',
              user_interest: formData.interes
            }
          })
        });
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSuccess) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 text-center ${className}`}>
        <div className="text-green-600 text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">
          ¡Descarga Exitosa!
        </h3>
        <p className="text-green-700 mb-4">
          Tu guía ha sido enviada a tu email. Revisa tu bandeja de entrada 
          (y la carpeta de spam) en los próximos minutos.
        </p>
        <p className="text-sm text-green-600">
          También recibirás tips semanales sobre plantas medicinales.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-lg ${className}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-4">
        {description}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
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
            value={formData.email}
            onChange={handleChange}
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
            value={formData.interes}
            onChange={handleChange}
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
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '⏳ Enviando...' : `📥 ${buttonText}`}
        </button>
      </form>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        Al descargar aceptas recibir emails con tips de plantas medicinales. 
        Puedes cancelar en cualquier momento.
      </p>
    </div>
  );
}
