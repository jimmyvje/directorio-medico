'use client';

import { useState, FormEvent } from 'react';

interface FormData {
    nombre: string;
    email: string;
    asunto: string;
    mensaje: string;
}

export default function ContactForm() {
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al enviar el mensaje');
            }

            setStatus('success');
            setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.message || 'Ocurrió un error inesperado');
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">¡Mensaje Enviado!</h3>
                <p className="text-slate-600 mb-6">
                    Gracias por contactarnos. Te responderemos pronto.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="text-cyan-700 hover:underline font-medium"
                >
                    Enviar otro mensaje
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-slate-700 mb-2">
                        Nombre completo *
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                        placeholder="Tu nombre"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Correo electrónico *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                        placeholder="tu@email.com"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="asunto" className="block text-sm font-medium text-slate-700 mb-2">
                    Asunto *
                </label>
                <select
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow bg-white"
                >
                    <option value="">Selecciona un asunto</option>
                    <option value="Registrar mi consultorio">Registrar mi consultorio</option>
                    <option value="Problema con mi listado">Problema con mi listado</option>
                    <option value="Consulta general">Consulta general</option>
                    <option value="Reportar un error">Reportar un error</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>

            <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-slate-700 mb-2">
                    Mensaje *
                </label>
                <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                />
            </div>

            {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {status === 'loading' ? (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Enviar Mensaje
                    </>
                )}
            </button>
        </form>
    );
}
