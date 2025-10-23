import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Plantas Medicinales Naturales - Enciclopedia Completa",
  description: "Descubre el poder curativo de más de 550 hierbas medicinales con propiedades terapéuticas documentadas científicamente. Medicina natural segura y efectiva.",
  keywords: "plantas medicinales, hierbas curativas, medicina natural, remedios caseros, fitoterapia",
  authors: [{ name: "Especialistas en Plantas Medicinales" }],
  openGraph: {
    title: "Plantas Medicinales Naturales - Enciclopedia Completa",
    description: "Descubre el poder curativo de más de 550 hierbas medicinales con propiedades terapéuticas documentadas científicamente.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Plantas Medicinales Naturales",
              "url": "https://plantas-medicinales-weld.vercel.app",
              "description": "Enciclopedia completa de plantas medicinales con información científica y tradicional",
              "sameAs": [
                "https://go.hotmart.com/H102540942W"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <script src="/analytics.js" async></script>
        <Analytics />
      </body>
    </html>
  );
}
