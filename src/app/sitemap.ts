import { MetadataRoute } from 'next'
import plantasData from '@/data/plantas.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://plantas-medicinales-weld.vercel.app'
  
  // Páginas principales
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/plantas-medicinales/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Páginas de plantas individuales
  const plantPages = plantasData.map((planta) => ({
    url: `${baseUrl}/plantas-medicinales/${planta.id}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...plantPages]
}
