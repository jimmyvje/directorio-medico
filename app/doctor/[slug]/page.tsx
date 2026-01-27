import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const runtime = 'edge';

import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { DirectoryListing } from '@/types/database';
import AdBanner from '@/components/AdBanner';

interface DoctorPageProps {
    params: Promise<{ slug: string }>;
}

async function getDoctor(slug: string): Promise<DirectoryListing | null> {
    const { data, error } = await supabase
        .from('directory_listings')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        return null;
    }

    return data as DirectoryListing;
}

export async function generateMetadata({ params }: DoctorPageProps): Promise<Metadata> {
    const { slug } = await params;
    const doctor = await getDoctor(slug);

    if (!doctor) {
        return {
            title: 'Doctor no encontrado',
        };
    }

    const title = `${doctor.nombre}${doctor.especialidad ? ` - ${doctor.especialidad}` : ''}`;
    const description = `${doctor.nombre}${doctor.especialidad ? `, especialista en ${doctor.especialidad}` : ''}. ${doctor.is_verified ? 'Perfil verificado. Agenda tu cita online.' : 'Consulta su información de contacto.'}`;

    return {
        title,
        description,
        openGraph: {
            title: `${title} | Directorio Médico del Ecuador`,
            description,
            type: 'profile',
            ...(doctor.foto_url && { images: [doctor.foto_url] }),
        },
        twitter: {
            card: 'summary',
            title,
            description,
        },
    };
}

export default async function DoctorPage({ params }: DoctorPageProps) {
    const { slug } = await params;
    const doctor = await getDoctor(slug);

    if (!doctor) {
        notFound();
    }

    // Build the booking URL for verified doctors
    const bookingUrl = doctor.is_verified && doctor.consultorio_id
        ? `https://app.clinify.io/booking/${doctor.consultorio_id}`
        : null;

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/" className="hover:text-cyan-700 transition-colors">
                            Inicio
                        </Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/buscar" className="hover:text-cyan-700 transition-colors">
                            Doctores
                        </Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-slate-900 font-medium truncate">
                            {doctor.nombre}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Doctor Profile Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            {/* Header with gradient */}
                            <div className="h-32 bg-gradient-to-r from-cyan-600 to-cyan-700" />

                            <div className="px-6 pb-6">
                                {/* Avatar and Basic Info */}
                                <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-16 mb-6">
                                    {doctor.foto_url ? (
                                        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                                            <Image
                                                src={doctor.foto_url}
                                                alt={doctor.nombre}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 128px, 128px"
                                                priority
                                            />
                                        </div>
                                    ) : (
                                        <div className="
                                            w-32 h-32 rounded-2xl
                                            bg-gradient-to-br from-cyan-500 to-cyan-700
                                            flex items-center justify-center
                                            text-white text-4xl font-bold
                                            border-4 border-white
                                            shadow-xl
                                            flex-shrink-0
                                        ">
                                            {doctor.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                                                {doctor.nombre}
                                            </h1>
                                            {doctor.is_verified && (
                                                <span className="
                                                    inline-flex items-center gap-1.5
                                                    px-3 py-1
                                                    bg-emerald-100
                                                    text-emerald-700
                                                    text-sm font-medium
                                                    rounded-full
                                                ">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Perfil Verificado
                                                </span>
                                            )}
                                        </div>
                                        {doctor.especialidad && (
                                            <p className="text-lg text-cyan-700 font-medium mt-1">
                                                {doctor.especialidad}
                                            </p>
                                        )}
                                        {doctor.ciudad && (
                                            <div className="flex items-center gap-2 text-slate-500 mt-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {doctor.ciudad}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                                    {doctor.is_verified && bookingUrl ? (
                                        <>
                                            <a
                                                href={bookingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="
                                                    flex-1 inline-flex items-center justify-center gap-2
                                                    px-6 py-4
                                                    bg-gradient-to-r from-cyan-600 to-cyan-700
                                                    hover:from-cyan-700 hover:to-cyan-800
                                                    text-white font-semibold text-lg
                                                    rounded-xl
                                                    shadow-lg hover:shadow-xl
                                                    transform hover:scale-[1.02]
                                                    transition-all duration-200
                                                "
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Agendar Online
                                            </a>
                                            <button
                                                className="
                                                    px-6 py-4
                                                    bg-slate-100
                                                    hover:bg-slate-200
                                                    text-slate-700
                                                    font-medium
                                                    rounded-xl
                                                    transition-colors
                                                    flex items-center justify-center gap-2
                                                "
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                </svg>
                                                Compartir
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full p-6 bg-slate-50 rounded-xl">
                                            <h3 className="font-semibold text-slate-900 mb-3">
                                                Información de Contacto
                                            </h3>
                                            <p className="text-slate-600 mb-4">
                                                Este profesional aún no tiene agenda online habilitada. Contáctalo directamente para agendar una cita.
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    className="
                                                        inline-flex items-center gap-2
                                                        px-4 py-2
                                                        bg-cyan-100
                                                        text-cyan-700
                                                        font-medium
                                                        rounded-lg
                                                        hover:bg-cyan-200
                                                        transition-colors
                                                    "
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    Llamar
                                                </button>
                                                <button
                                                    className="
                                                        inline-flex items-center gap-2
                                                        px-4 py-2
                                                        bg-emerald-100
                                                        text-emerald-700
                                                        font-medium
                                                        rounded-lg
                                                        hover:bg-emerald-200
                                                        transition-colors
                                                    "
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                    </svg>
                                                    WhatsApp
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
                            <h2 className="text-xl font-semibold text-slate-900 mb-4">
                                Acerca del Doctor
                            </h2>
                            <p className="text-slate-600">
                                {doctor.nombre} es especialista en {doctor.especialidad}.
                                {doctor.is_verified && ' Este perfil ha sido verificado por nuestro equipo para garantizar la autenticidad de la información.'}
                            </p>

                            {/* Specialties Tags */}
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-slate-500 mb-3">
                                    Especialidad Principal
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {doctor.especialidad && (
                                        <span className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-medium">
                                            {doctor.especialidad}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Ad Banner - Inline */}
                        <div className="mt-6">
                            <AdBanner slot="inline" />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80 space-y-6">
                        <AdBanner slot="sidebar" />

                        {/* Related Doctors Placeholder */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-4">
                                Doctores Relacionados
                            </h3>
                            <p className="text-sm text-slate-500">
                                Otros especialistas en {doctor.especialidad || 'esta categoría'}
                            </p>
                            <Link
                                href={`/buscar?q=${encodeURIComponent(doctor.especialidad || '')}`}
                                className="
                                    mt-4 inline-flex items-center gap-2
                                    text-cyan-600 hover:text-cyan-700
                                    font-medium text-sm
                                    transition-colors
                                "
                            >
                                Ver todos
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        <AdBanner slot="sidebar" />
                    </aside>
                </div>
            </div>
        </div>
    );
}
