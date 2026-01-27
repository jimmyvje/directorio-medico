import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Directorio Médico del Ecuador | Encuentra tu Doctor",
    template: "%s | Directorio Médico del Ecuador",
  },
  description: "Encuentra los mejores doctores y especialistas médicos en Ecuador. Agenda citas online de forma rápida y segura.",
  keywords: ["doctores", "médicos", "especialistas", "citas médicas", "salud", "directorio médico", "ecuador"],
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: "Directorio Médico del Ecuador",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-cyan-700">
                  Directorio Médico del Ecuador
                </span>
              </Link>
              <nav className="flex items-center gap-4 sm:gap-6">
                <Link
                  href="/buscar"
                  className="text-slate-600 hover:text-cyan-700 transition-colors font-medium"
                >
                  Buscar
                </Link>
                <Link
                  href="/contacto"
                  className="text-slate-600 hover:text-cyan-700 transition-colors font-medium"
                >
                  Contacto
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="font-bold text-slate-900">Directorio Médico del Ecuador</span>
                </div>
                <p className="text-slate-600 text-sm">
                  Tu plataforma de confianza para encontrar especialistas médicos.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Enlaces</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><Link href="/" className="hover:text-cyan-700 transition-colors">Inicio</Link></li>
                  <li><Link href="/buscar" className="hover:text-cyan-700 transition-colors">Buscar Consultorios</Link></li>
                  <li><Link href="/contacto" className="hover:text-cyan-700 transition-colors">Contacto</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li><a href="#" className="hover:text-cyan-700 transition-colors">Términos de Servicio</a></li>
                  <li><a href="#" className="hover:text-cyan-700 transition-colors">Política de Privacidad</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
              <p className="mb-2">© {new Date().getFullYear()} Directorio Médico del Ecuador. Todos los derechos reservados.</p>
              <p>
                Tecnología por{' '}
                <a
                  href="https://clinify.pages.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-700 hover:underline font-medium"
                >
                  Clinify
                </a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
