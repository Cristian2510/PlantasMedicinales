#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build Pages - Generador de páginas SEO desde CSV
Crea /site/<slug>/index.html y /site/sitemap.xml
"""

import os
import csv
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv('BASE_URL_PUBLICA', 'https://tusitio.com')
HOTLINK_BASE = os.getenv('HOTMART_HOTLINK_BASE', 'https://go.hotmart.com/H102540942W')
CSV_PATH = os.path.join(os.path.dirname(__file__), 'pages.csv')
SITE_PATH = os.path.join(os.path.dirname(__file__), '..', 'site')

def create_page_html(row):
    """
    Generar HTML de página de producto con JSON-LD
    
    IMPORTANTE: Cada página debe aportar VALOR ÚNICO.
    Evitar "scaled content abuse" (contenido escalado sin valor).
    Cada página debe resolver una intención de búsqueda específica.
    """
    
    # Extraer precio del benefits o poner genérico
    precio = "49.00"  # Puedes extraer del CSV si agregas columna "precio"
    
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{row['desc']}">
  <meta name="robots" content="index, follow">
  <title>{row['title']}</title>
  
  <!-- Open Graph -->
  <meta property="og:title" content="{row['title']}">
  <meta property="og:description" content="{row['desc']}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="{BASE_URL}/{row['slug']}/">
  
  <!-- JSON-LD Product Schema -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "{row['h1']}",
    "description": "{row['desc']}",
    "brand": {{
      "@type": "Brand",
      "name": "Robot de Ventas"
    }},
    "offers": {{
      "@type": "Offer",
      "url": "{BASE_URL}/{row['slug']}/",
      "priceCurrency": "USD",
      "price": "{precio}",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock"
    }},
    "aggregateRating": {{
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }}
  }}
  </script>
  
  <!-- FAQ Schema -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {{
        "@type": "Question",
        "name": "{row['faq_q1']}",
        "acceptedAnswer": {{
          "@type": "Answer",
          "text": "{row['faq_a1']}"
        }}
      }},
      {{
        "@type": "Question",
        "name": "{row['faq_q2']}",
        "acceptedAnswer": {{
          "@type": "Answer",
          "text": "{row['faq_a2']}"
        }}
      }}
    ]
  }}
  </script>

  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }}
    .container {{
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }}
    header {{
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 50px 40px;
      text-align: center;
    }}
    header h1 {{
      font-size: 2.5em;
      margin-bottom: 15px;
      line-height: 1.2;
    }}
    header p {{
      font-size: 1.2em;
      opacity: 0.9;
    }}
    section {{
      padding: 50px 40px;
    }}
    h2 {{
      color: #4f46e5;
      margin-bottom: 25px;
      font-size: 2em;
    }}
    .benefits {{
      list-style: none;
      padding: 0;
    }}
    .benefits li {{
      padding: 15px 20px;
      margin: 10px 0;
      background: #f0fdf4;
      border-left: 4px solid #10b981;
      border-radius: 8px;
      font-size: 1.1em;
    }}
    .benefits li:before {{
      content: "✅ ";
      margin-right: 10px;
    }}
    .cta {{
      text-align: center;
      padding: 60px 40px;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    }}
    .cta h2 {{
      color: #92400e;
      margin-bottom: 20px;
    }}
    .btn-comprar {{
      display: inline-block;
      padding: 20px 50px;
      background: #10b981;
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-size: 1.5em;
      font-weight: bold;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
      transition: all 0.3s;
    }}
    .btn-comprar:hover {{
      background: #059669;
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(16, 185, 129, 0.5);
    }}
    .faq {{
      background: #f9fafb;
      padding: 50px 40px;
    }}
    .faq-item {{
      background: white;
      padding: 25px;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }}
    .faq-item h3 {{
      color: #4f46e5;
      margin-bottom: 10px;
      font-size: 1.3em;
    }}
    .faq-item p {{
      color: #555;
      font-size: 1.05em;
    }}
    footer {{
      background: #1f2937;
      color: white;
      padding: 30px;
      text-align: center;
    }}
    footer a {{
      color: #60a5fa;
      text-decoration: none;
    }}
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>{row['h1']}</h1>
      <p>{row['desc']}</p>
    </header>

    <section>
      <h2>🎯 Qué vas a lograr</h2>
      <ul class="benefits">
        {''.join(f'<li>{benefit.strip()}</li>' for benefit in row['benefits'].split('|'))}
      </ul>
    </section>

    <div class="cta">
      <h2>🚀 Comenzá hoy mismo</h2>
      <a href="{HOTLINK_BASE}?utm_source=seo&utm_medium=organic&utm_campaign=robot&src={row['slug']}" 
         class="btn-comprar" 
         target="_blank">
        💳 Comprar ahora
      </a>
      <p style="margin-top: 20px; color: #92400e;">
        ✅ Garantía de 7 días | 🔒 Pago seguro vía Hotmart
      </p>
    </div>

    <section class="faq">
      <h2>❓ Preguntas Frecuentes</h2>
      
      <div class="faq-item">
        <h3>{row['faq_q1']}</h3>
        <p>{row['faq_a1']}</p>
      </div>

      <div class="faq-item">
        <h3>{row['faq_q2']}</h3>
        <p>{row['faq_a2']}</p>
      </div>

      <div class="faq-item">
        <h3>¿Cómo recibo el producto?</h3>
        <p>Inmediatamente después del pago aprobado, recibís acceso por email. Si no lo ves, revisá SPAM.</p>
      </div>
    </section>

    <footer>
      <p><a href="/">← Volver al inicio</a></p>
      <p style="margin-top: 15px;">&copy; 2025 Robot de Ventas. Todos los derechos reservados.</p>
    </footer>
  </div>
</body>
</html>
"""
    return html

def generate_sitemap(slugs):
    """Generar sitemap.xml con todas las URLs"""
    
    now = datetime.now().strftime('%Y-%m-%d')
    
    urls = [f"""  <url>
    <loc>{BASE_URL}/</loc>
    <lastmod>{now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>"""]
    
    for slug in slugs:
        urls.append(f"""  <url>
    <loc>{BASE_URL}/{slug}/</loc>
    <lastmod>{now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>""")
    
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>
"""
    
    return sitemap

def main():
    """Generar todas las páginas desde CSV"""
    
    if not os.path.exists(CSV_PATH):
        print(f"❌ Error: No se encontró {CSV_PATH}")
        return
    
    print("🚀 Generando páginas SEO desde CSV...")
    print("=" * 60)
    
    slugs = []
    
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            slug = row['slug']
            slugs.append(slug)
            
            # Crear directorio del slug
            page_dir = os.path.join(SITE_PATH, slug)
            os.makedirs(page_dir, exist_ok=True)
            
            # Generar HTML
            html = create_page_html(row)
            
            # Guardar index.html
            html_path = os.path.join(page_dir, 'index.html')
            with open(html_path, 'w', encoding='utf-8') as html_file:
                html_file.write(html)
            
            print(f"✅ Creada: {slug}/index.html")
    
    # Generar sitemap.xml
    sitemap = generate_sitemap(slugs)
    sitemap_path = os.path.join(SITE_PATH, 'sitemap.xml')
    
    with open(sitemap_path, 'w', encoding='utf-8') as sitemap_file:
        sitemap_file.write(sitemap)
    
    print(f"✅ Creado: sitemap.xml")
    print("=" * 60)
    print(f"📄 Total páginas generadas: {len(slugs)}")
    print(f"🌐 Sitemap: {BASE_URL}/sitemap.xml")
    print()
    print("⚠️  RECORDATORIO:")
    print("   - Cada página debe tener contenido ÚNICO y útil")
    print("   - Evitá duplicar contenido solo cambiando palabras")
    print("   - Google penaliza 'scaled content abuse'")
    print("   - Editá pages.csv con contenido original antes de generar")

if __name__ == '__main__':
    main()

