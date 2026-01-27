'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Especialidad {
    id: string;
    nombre: string;
}

interface SearchFormProps {
    initialEspecialidadId?: string;
    size?: 'large' | 'compact';
}

export default function SearchForm({
    initialEspecialidadId = '',
    size = 'large'
}: SearchFormProps) {
    const router = useRouter();
    const [especialidadId, setEspecialidadId] = useState(initialEspecialidadId);
    const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchEspecialidades() {
            try {
                const { data, error } = await supabase
                    .from('especialidades')
                    .select('id, nombre')
                    .order('nombre');

                if (error) {
                    console.error('Error fetching especialidades:', error);
                    return;
                }

                setEspecialidades((data as Especialidad[]) || []);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchEspecialidades();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (especialidadId) {
            router.push(`/buscar?especialidad=${especialidadId}`);
        } else {
            router.push('/buscar');
        }
    };

    const handleVerTodos = () => {
        router.push('/buscar');
    };

    const isLarge = size === 'large';

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className={`
                flex flex-col gap-4
                ${isLarge ? 'p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200' : ''}
            `}>
                <div className="w-full">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Selecciona una especialidad
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <select
                            value={especialidadId}
                            onChange={(e) => setEspecialidadId(e.target.value)}
                            disabled={isLoading}
                            className={`
                                w-full pl-12 pr-10 ${isLarge ? 'py-4 text-lg' : 'py-3'}
                                bg-slate-50
                                border border-slate-200
                                rounded-xl
                                focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                                transition-all duration-200
                                appearance-none
                                cursor-pointer
                                ${isLoading ? 'opacity-50' : ''}
                            `}
                        >
                            <option value="">Todas las especialidades</option>
                            {especialidades.map((esp) => (
                                <option key={esp.id} value={esp.id}>
                                    {esp.nombre}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className={`flex ${isLarge ? 'flex-col sm:flex-row' : 'flex-row'} gap-3`}>
                    <button
                        type="submit"
                        className={`
                            flex-1
                            ${isLarge ? 'px-8 py-4 text-lg' : 'px-6 py-3'}
                            bg-gradient-to-r from-cyan-600 to-cyan-700
                            hover:from-cyan-700 hover:to-cyan-800
                            text-white font-semibold
                            rounded-xl
                            shadow-lg hover:shadow-xl
                            transform hover:scale-[1.02]
                            transition-all duration-200
                            flex items-center justify-center gap-2
                        `}
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Buscar Consultorios
                    </button>

                    <button
                        type="button"
                        onClick={handleVerTodos}
                        className={`
                            ${isLarge ? 'px-8 py-4 text-lg' : 'px-6 py-3'}
                            bg-slate-100
                            hover:bg-slate-200
                            text-slate-700
                            font-medium
                            rounded-xl
                            transition-colors
                            flex items-center justify-center gap-2
                        `}
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Ver Todos
                    </button>
                </div>
            </div>
        </form>
    );
}
