import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { Consultorio, SearchIndexItem } from '@/types/database';

export const runtime = 'edge';

import SearchForm from '@/components/SearchForm';
import ConsultorioCard from '@/components/ConsultorioCard';
import AdBanner from '@/components/AdBanner';
import Pagination from '@/components/Pagination';

interface SearchPageProps {
    searchParams: Promise<{
        especialidad?: string;
        page?: string;
    }>;
}

interface Especialidad {
    id: string;
    nombre: string;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
    const params = await searchParams;
    const especialidadId = params.especialidad;

    let title = 'Buscar Consultorios';
    let description = 'Encuentra los mejores consultorios médicos.';

    if (especialidadId) {
        const { data: esp } = await supabase
            .from('especialidades')
            .select('nombre')
            .eq('id', especialidadId)
            .single();

        if (esp) {
            const nombre = (esp as { nombre: string }).nombre;
            title = `Consultorios de ${nombre}`;
            description = `Encuentra consultorios con especialistas en ${nombre}.`;
        }
    }

    return {
        title,
        description,
        openGraph: { title: `${title} | Directorio Médico del Ecuador`, description },
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const especialidadId = params.especialidad || '';
    const currentPage = Number(params.page) || 1;
    const ITEMS_PER_PAGE = 20;

    let especialidadNombre = '';

    // Fetch Especialidad details if filtered
    if (especialidadId) {
        const { data: esp } = await supabase
            .from('especialidades')
            .select('nombre')
            .eq('id', especialidadId)
            .single();

        if (esp) {
            especialidadNombre = (esp as { nombre: string }).nombre;
        }
    }

    // MAIN QUERY using the SQL VIEW
    let query = supabase
        .from('search_index')
        .select('*', { count: 'exact' });

    // Apply Filter
    if (especialidadId) {
        // La vista devuelve un array de UUIDs en especialidad_ids
        query = query.contains('especialidad_ids', [especialidadId]);
    }

    // Sort: Verified first, then Name
    query = query
        .order('is_verified', { ascending: false })
        .order('nombre', { ascending: true })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

    const { data: resultadosRaw, count, error } = await query;
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (error) {
        console.error('Error fetching search results:', error);
    }

    const resultados = (resultadosRaw as SearchIndexItem[] || []).map(item => {
        // Construir objeto "Consultorio" dummy compatible con ConsultorioCard
        const consultorio: Consultorio = {
            id: item.id,
            nombre: item.nombre,
            slug: item.slug,
            direccion: item.direccion,
            logo_url: item.logo_url,
            created_at: item.created_at,
            // Defaults placeholders
            duracion_cita_minutos: 30,
            hora_apertura: '09:00',
            hora_cierre: '18:00',
            telefono: null,
            color_tema: '#0e7490',
            ruc: null,
            tipo_consultorio: 'MEDICINA_GENERAL' // Dummy
        };

        return {
            ...item,
            consultorioObj: consultorio
        };
    });

    const { data: todasEspecialidades } = await supabase
        .from('especialidades')
        .select('id, nombre')
        .order('nombre');

    return (
        <div className="min-h-screen">
            <div className="bg-gradient-to-b from-cyan-50 to-transparent py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SearchForm initialEspecialidadId={especialidadId} size="compact" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {especialidadNombre ? `Consultorios de ${especialidadNombre}` : 'Todos los Consultorios'}
                                </h1>
                                <p className="text-slate-500 mt-1">
                                    {totalItems} {totalItems === 1 ? 'resultado' : 'resultados'}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <AdBanner slot="inline" />
                        </div>

                        {resultados.length > 0 ? (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {resultados.map((item) => (
                                        <ConsultorioCard
                                            key={`${item.source_type}-${item.id}`}
                                            consultorio={item.consultorioObj}
                                            doctores={item.doctores_data}
                                            especialidades={[]}
                                            especialidadLabel={item.especialidad_label || ''}
                                            isVerified={item.is_verified}
                                        />
                                    ))}
                                </div>

                                <Pagination totalPages={totalPages} />
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    No se encontraron consultorios
                                </h3>
                                <p className="text-slate-500">
                                    Prueba seleccionando otra especialidad o ve todos los consultorios.
                                </p>
                            </div>
                        )}

                        {resultados.length > 4 && (
                            <div className="mt-8">
                                <AdBanner slot="inline" />
                            </div>
                        )}
                    </div>

                    <aside className="lg:w-80 space-y-6">
                        <AdBanner slot="sidebar" />

                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-4">
                                Especialidades
                            </h3>
                            <div className="space-y-1 max-h-80 overflow-y-auto">
                                <a
                                    href="/buscar"
                                    className={`block px-4 py-2 rounded-lg transition-colors ${!especialidadId
                                        ? 'bg-cyan-100 text-cyan-700 font-medium'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    Ver todos
                                </a>
                                {(todasEspecialidades as Especialidad[] || []).map((esp) => (
                                    <a
                                        key={esp.id}
                                        href={`/buscar?especialidad=${esp.id}`}
                                        className={`block px-4 py-2 rounded-lg transition-colors ${especialidadId === esp.id
                                            ? 'bg-cyan-100 text-cyan-700 font-medium'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {esp.nombre}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <AdBanner slot="sidebar" />
                    </aside>
                </div>
            </div>
        </div>
    );
}
