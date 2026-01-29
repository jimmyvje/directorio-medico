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
    if (doctores.length === 0) {
        const doctorPrincipal = await getDoctorPrincipal(consultorio.id);

        if (doctorPrincipal) {
            isVerified = doctorPrincipal.is_verified;
            if (doctorPrincipal.especialidad) {
                especialidadMostrada = doctorPrincipal.especialidad;
            }
        }

        if (!especialidadMostrada) {
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
                // @ts-ignore
                const nombreEspecialidadRelacionada = cualquierPerfil.especialidades?.nombre;
                if (nombreEspecialidadRelacionada) {
                    especialidadMostrada = nombreEspecialidadRelacionada;
                } else if (cualquierPerfil.especialidad) {
                    especialidadMostrada = cualquierPerfil.especialidad;
                }
            }
        }
    } else {
        especialidadMostrada = tipoLabel[consultorio.tipo_consultorio] || consultorio.tipo_consultorio;
    }

    if (!especialidadMostrada) {
        especialidadMostrada = tipoLabel[consultorio.tipo_consultorio] || consultorio.tipo_consultorio;
    }

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
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header with Gradient */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700">
                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <nav className="flex items-center gap-2 text-sm text-white/70">
                        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/buscar" className="hover:text-white transition-colors">Consultorios</Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-white font-medium truncate">{consultorio.nombre}</span>
                    </nav>
                </div>

                {/* Main Header Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Logo/Avatar */}
                        {consultorio.logo_url ? (
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white/30 shadow-xl flex-shrink-0">
                                <Image
                                    src={consultorio.logo_url}
                                    alt={consultorio.nombre}
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center text-cyan-700 text-3xl sm:text-4xl font-bold border-4 border-white/30 shadow-xl flex-shrink-0 bg-white">
                                {consultorio.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                {consultorio.nombre}
                            </h1>

                            <div className="flex flex-wrap items-center gap-2 mt-3">
                                {especialidadMostrada && (
                                    <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                                        {especialidadMostrada}
                                    </span>
                                )}
                                {isVerified && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-green-400/90 text-white text-sm font-medium rounded-full">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Verificado
                                    </span>
                                )}
                            </div>

                            {consultorio.direccion && (
                                <div className="flex items-center gap-2 text-white/80 mt-3">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{consultorio.direccion}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area - Overlapping Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Info Cards */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {consultorio.telefono && (
                                    <a
                                        href={`tel:${consultorio.telefono}`}
                                        className="flex flex-col items-center p-4 bg-slate-50 rounded-xl hover:bg-cyan-50 transition-colors group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mb-3 group-hover:bg-cyan-200 transition-colors">
                                            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-1">Teléfono</p>
                                        <p className="font-semibold text-slate-900 text-center">{consultorio.telefono}</p>
                                    </a>
                                )}

                                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
                                    <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">Horario</p>
                                    <p className="font-semibold text-slate-900">
                                        {consultorio.hora_apertura?.slice(0, 5)} - {consultorio.hora_cierre?.slice(0, 5)}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
                                    <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {doctores.length > 0 ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            )}
                                        </svg>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">{doctores.length > 0 ? 'Tipo' : 'Tipo'}</p>
                                    <p className="font-semibold text-slate-900">
                                        {doctores.length > 0 ? 'Centro Médico' : 'Independiente'}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
                                    <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-1">Duración cita</p>
                                    <p className="font-semibold text-slate-900">{consultorio.duracion_cita_minutos} min</p>
                                </div>

                                {doctores.length > 0 && (
                                    <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl">
                                        <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-1">Doctores</p>
                                        <p className="font-semibold text-slate-900">{doctores.length}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Doctores Section */}
                        {doctores.length > 0 && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Nuestros Doctores
                                </h2>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {doctores.map((doctor) => {
                                        // @ts-ignore
                                        const especialidadDoc = doctor.especialidades?.nombre || doctor.especialidad;
                                        return (
                                            <div
                                                key={doctor.id}
                                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all"
                                            >
                                                {doctor.foto_url ? (
                                                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                                                        <Image
                                                            src={doctor.foto_url}
                                                            alt={doctor.nombre_completo || ''}
                                                            fill
                                                            className="object-cover"
                                                            sizes="56px"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                                                        {doctor.nombre_completo?.split(' ').map((n: string) => n[0]).slice(0, 2).join('') || '?'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-slate-900">{doctor.nombre_completo}</p>
                                                    {especialidadDoc && (
                                                        <p className="text-sm text-cyan-600 font-medium">{especialidadDoc}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80 space-y-6">
                        {/* Especialidades Card */}
                        {especialidades.length > 0 && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    Especialidades
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {especialidades.map((esp) => (
                                        <span key={esp} className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg text-sm font-medium border border-cyan-200">
                                            {esp}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA Card */}
                        <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl shadow-lg p-6 text-white">
                            <h3 className="font-bold text-lg mb-2">¿Necesitas agendar una cita?</h3>
                            <p className="text-white/80 text-sm mb-4">
                                Contacta directamente al consultorio para programar tu visita.
                            </p>
                            {consultorio.telefono && (
                                <a
                                    href={`tel:${consultorio.telefono}`}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white text-cyan-700 font-semibold rounded-xl hover:bg-cyan-50 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Llamar ahora
                                </a>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Bottom spacing */}
            <div className="h-12"></div>
        </div>
    );
}

export const runtime = 'edge';
