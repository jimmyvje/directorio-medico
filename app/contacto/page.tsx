import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
    title: 'Contacto',
    description: 'Ponte en contacto con nosotros. Responderemos a la brevedad.',
};

export default function ContactoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-transparent">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center shadow-xl">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Contáctanos
                    </h1>
                    <p className="text-lg text-slate-600 max-w-xl mx-auto">
                        ¿Tienes alguna pregunta, sugerencia o deseas registrar tu consultorio?
                        Escríbenos y te responderemos a la brevedad.
                    </p>
                </div>

                {/* Contact Form Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <ContactForm />
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-slate-500 text-sm">
                        También puedes escribirnos directamente a{' '}
                        <a href="mailto:soporte@clinifymed.com" className="text-cyan-700 hover:underline font-medium">
                            soporte@clinifymed.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
