import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Consultorio, Perfil, DirectoryListing } from '@/types/database';



interface ConsultorioPageProps {
    params: Promise<{ slug: string }>;
}

async function getConsultorio(slug: string) {
    const { data, error } = await supabase
        .from('consultorios')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        return null;
    }

    return data as Consultorio;
}

async function getDoctores(consultorioId: string) {
    const { data } = await supabase
        .from('perfiles')
        .select(`
            *,
            especialidades (
                nombre
            )
        `)
        .eq('consultorio_id', consultorioId)
        .eq('rol', 'DOCTOR');

    return (data as any[]) || [];
}

async function getDoctorPrincipal(consultorioId: string) {
    const { data } = await supabase
        .from('directory_listings')
        .select('*')
        .eq('consultorio_id', consultorioId)
        .single();

    return data as DirectoryListing | null;
}

export async function generateMetadata({ params }: ConsultorioPageProps): Promise<Metadata> {
    const { slug } = await params;
    const consultorio = await getConsultorio(slug);

    if (!consultorio) {
        return { title: 'Consultorio no encontrado' };
    }

    const title = consultorio.nombre;
    const description = `${consultorio.nombre}${consultorio.direccion ? ` - ${consultorio.direccion}` : ''}. Agenda tu cita online.`;

    return {
        title,
        description,
        openGraph: {
            title: `${title} | Directorio Médico del Ecuador`,
            description,
            type: 'profile',
            ...(consultorio.logo_url && { images: [consultorio.logo_url] }),
        },
    };
}

export default async function ConsultorioPage({ params }: ConsultorioPageProps) {
    const { slug } = await params;
    const consultorio = await getConsultorio(slug);

    if (!consultorio) {
        notFound();
    }

    const doctores = await getDoctores(consultorio.id);
    let especialidadMostrada = '';
    let isVerified = false;

    const tipoLabel: Record<string, string> = {
        'MEDICINA_GENERAL': 'Medicina General',
        'ODONTOLOGIA': 'Odontología',
        'MIXTO': 'Mixto',
    };

    // Si no hay doctores listados (rol DOCTOR), es consultorio independiente
    // Buscamos la especialidad del dueño/admin en directory_listings o en perfiles
    if (doctores.length === 0) {
        const doctorPrincipal = await getDoctorPrincipal(consultorio.id);

        if (doctorPrincipal) {
            isVerified = doctorPrincipal.is_verified;
            if (doctorPrincipal.especialidad) {
                especialidadMostrada = doctorPrincipal.especialidad;
            }
        }

        if (!especialidadMostrada) {
            // Si no hay directory listing explícito con especialidad, buscar cualquier perfil asociado
            // Priorizando obtener el nombre de la especialidad desde la tabla relacionada si existe ID
            const { data: cualquierPerfil } = await supabase
                .from('perfiles')
                .select(`
                    especialidad,
                    especialidad_id,
                    especialidades (
                        nombre
                    )
                `)
                .eq('consultorio_id', consultorio.id)
                .limit(1)
                .single();

            if (cualquierPerfil) {
                // @ts-ignore - Supabase tipos anidados a veces dan error en TS estricto
                const nombreEspecialidadRelacionada = cualquierPerfil.especialidades?.nombre;

                // Prioridad: 1. Nombre de la relación (DB normalizada), 2. Texto libre en perfil
                if (nombreEspecialidadRelacionada) {
                    especialidadMostrada = nombreEspecialidadRelacionada;
                } else if (cualquierPerfil.especialidad) {
                    especialidadMostrada = cualquierPerfil.especialidad;
                }
            }
        }
    } else {
        // Lógica original: mostrar tipo de consultorio si hay múltiples doctores
        especialidadMostrada = tipoLabel[consultorio.tipo_consultorio] || consultorio.tipo_consultorio;
    }

    // Fallback final: si aún no tenemos especialidad (caso raro independiente sin datos), usar tipo consultorio
    if (!especialidadMostrada) {
        especialidadMostrada = tipoLabel[consultorio.tipo_consultorio] || consultorio.tipo_consultorio;
    }

    // Calcular especialidades para el sidebar
    const especialidadesSet = new Set<string>();
    doctores.forEach((d: any) => {
        // @ts-ignore
        const esp = d.especialidades?.nombre || d.especialidad;
        if (esp) especialidadesSet.add(esp);
    });
    if (especialidadMostrada) {
        especialidadesSet.add(especialidadMostrada);
    }
    const especialidades = Array.from(especialidadesSet);


    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/" className="hover:text-cyan-700 transition-colors">Inicio</Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/buscar" className="hover:text-cyan-700 transition-colors">Consultorios</Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-slate-900 font-medium truncate">{consultorio.nombre}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        {/* Consultorio Header */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div
                                className="h-32 bg-gradient-to-r from-cyan-600 to-cyan-700"
                            />
                            <div className="px-6 pb-6">
                                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 mb-6">
                                    {consultorio.logo_url ? (
                                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                                            <Image
                                                src={consultorio.logo_url}
                                                alt={consultorio.nombre}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 128px, 128px"
                                                priority
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="w-32 h-32 rounded-2xl flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-xl flex-shrink-0 bg-cyan-600"
                                        >
                                            {consultorio.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                                            {consultorio.nombre}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            {especialidadMostrada && (
                                                <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm font-medium rounded-full">
                                                    {especialidadMostrada}
                                                </span>
                                            )}
                                            {isVerified && (
                                                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Verificado
                                                </span>
                                            )}
                                        </div>
                                        {consultorio.direccion && (
                                            <div className="flex items-center gap-2 text-slate-500 mt-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {consultorio.direccion}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Info Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-slate-200">
                                    {consultorio.telefono && (
                                        <div className="text-center p-4 bg-slate-50 rounded-xl">
                                            <svg className="w-6 h-6 mx-auto text-cyan-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <p className="text-sm text-slate-500">Teléfono</p>
                                            <p className="font-medium text-slate-900">{consultorio.telefono}</p>
                                        </div>
                                    )}
                                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                                        <svg className="w-6 h-6 mx-auto text-cyan-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm text-slate-500">Horario</p>
                                        <p className="font-medium text-slate-900">
                                            {consultorio.hora_apertura?.slice(0, 5)} - {consultorio.hora_cierre?.slice(0, 5)}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                                        <svg className="w-6 h-6 mx-auto text-cyan-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {doctores.length > 0 ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            )}
                                        </svg>
                                        <p className="text-sm text-slate-500">{doctores.length > 0 ? 'Doctores' : 'Tipo'}</p>
                                        <p className="font-medium text-slate-900">
                                            {doctores.length > 0 ? doctores.length : 'Independiente'}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                                        <svg className="w-6 h-6 mx-auto text-cyan-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-sm text-slate-500">Duración cita</p>
                                        <p className="font-medium text-slate-900">{consultorio.duracion_cita_minutos} min</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Doctores */}
                        {doctores.length > 0 && (
                            <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
                                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                                    Nuestros Doctores
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {doctores.map((doctor) => {
                                        // @ts-ignore
                                        const especialidadDoc = doctor.especialidades?.nombre || doctor.especialidad;
                                        return (
                                            <div key={doctor.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                                {doctor.foto_url ? (
                                                    <div className="relative w-14 h-14 rounded-full overflow-hidden">
                                                        <Image
                                                            src={doctor.foto_url}
                                                            alt={doctor.nombre_completo || ''}
                                                            fill
                                                            className="object-cover"
                                                            sizes="56px"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-white font-bold">
                                                        {doctor.nombre_completo?.split(' ').map((n: string) => n[0]).slice(0, 2).join('') || '?'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-slate-900">{doctor.nombre_completo}</p>
                                                    {especialidadDoc && (
                                                        <p className="text-sm text-cyan-600">{especialidadDoc}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Si es independiente (0 doctores) y tenemos info del doctor principal, mostramos algo? 
                            El usuario no lo pidió explícitamente, pero podría ser útil. 
                            Por ahora nos limitamos a sus requerimientos exactos. */}

                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80 space-y-6">

                        {/* Especialidades */}
                        {especialidades.length > 0 && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <h3 className="font-semibold text-slate-900 mb-4">Especialidades</h3>
                                <div className="flex flex-wrap gap-2">
                                    {especialidades.map((esp) => (
                                        <span key={esp} className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-medium">
                                            {esp}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </aside>
                </div>
            </div>
        </div>
    );
}

export const runtime = 'edge';
