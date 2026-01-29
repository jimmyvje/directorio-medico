'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Consultorio } from '@/types/database';
import { useState } from 'react';

interface Perfil {
    id: string;
    nombre_completo: string | null;
    especialidad: string | null;
    foto_url: string | null;
}

interface ConsultorioCardProps {
    consultorio: Consultorio;
    doctores: Perfil[];
    especialidades: string[];
    especialidadLabel?: string;
    isVerified?: boolean;
}

// Modal Component for non-verified listings
function ConsultorioModal({
    consultorio,
    especialidades,
    especialidadLabel,
    onClose
}: {
    consultorio: Consultorio;
    especialidades: string[];
    especialidadLabel?: string;
    onClose: () => void
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 rounded-t-2xl">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {consultorio.logo_url ? (
                                <div className="relative w-16 h-16 flex-shrink-0">
                                    <Image
                                        src={consultorio.logo_url}
                                        alt={consultorio.nombre}
                                        fill
                                        className="rounded-xl object-cover shadow-lg border-2 border-white/30"
                                        sizes="64px"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-cyan-700 text-xl font-bold flex-shrink-0 shadow-lg bg-white">
                                    {consultorio.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                </div>
                            )}
                            <div>
                                <h2 className="text-xl font-bold text-white">{consultorio.nombre}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    {especialidadLabel && (
                                        <span className="inline-block px-2.5 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full">
                                            {especialidadLabel}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Especialidades from label */}
                    {especialidadLabel && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                Especialidades
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-sm rounded-lg border border-cyan-200">
                                    {especialidadLabel}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Dirección */}
                    {consultorio.direccion && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Dirección
                            </h3>
                            <p className="text-slate-600">{consultorio.direccion}</p>
                        </div>
                    )}

                    {/* Teléfono */}
                    {consultorio.telefono && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Teléfono
                            </h3>
                            <a
                                href={`tel:${consultorio.telefono}`}
                                className="text-cyan-600 hover:text-cyan-700 font-medium hover:underline"
                            >
                                {consultorio.telefono}
                            </a>
                        </div>
                    )}

                    {/* Correo */}
                    {consultorio.correo && (
                        <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                                <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Correo electrónico
                            </h3>
                            <a
                                href={`mailto:${consultorio.correo}`}
                                className="text-cyan-600 hover:text-cyan-700 font-medium hover:underline break-all"
                            >
                                {consultorio.correo}
                            </a>
                        </div>
                    )}
                </div>

                {/* Footer with CTA */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                    <div className="text-center">
                        <p className="text-sm text-slate-600 mb-3">
                            ¿Eres el propietario de este consultorio?
                        </p>
                        <Link
                            href="/contacto"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-amber-900 text-sm font-medium rounded-lg hover:bg-amber-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Obtén verificación
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ConsultorioCard({ consultorio, doctores, especialidades, especialidadLabel, isVerified }: ConsultorioCardProps) {
    const [showModal, setShowModal] = useState(false);

    const tipoLabel = {
        'MEDICINA_GENERAL': 'Medicina General',
        'ODONTOLOGIA': 'Odontología',
        'MIXTO': 'Mixto',
    };

    const cardContent = (
        <div className="overflow-hidden">
            {/* Header with gradient - Name always in cyan */}
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-4">
                <div className="flex items-center gap-4">
                    {consultorio.logo_url ? (
                        <div className="relative w-14 h-14 flex-shrink-0">
                            <Image
                                src={consultorio.logo_url}
                                alt={consultorio.nombre}
                                fill
                                className="rounded-xl object-cover shadow-lg border-2 border-white/30"
                                sizes="56px"
                            />
                        </div>
                    ) : (
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-cyan-700 text-lg font-bold flex-shrink-0 shadow-lg bg-white">
                            {consultorio.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-white truncate">
                            {consultorio.nombre}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="inline-block px-2 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full">
                                {especialidadLabel || tipoLabel[consultorio.tipo_consultorio] || consultorio.tipo_consultorio}
                            </span>
                            {isVerified && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-400/90 text-white text-xs font-medium rounded-full">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Verificado
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="p-4">
                {consultorio.direccion && (
                    <div className="flex items-start gap-2 text-slate-600 text-sm">
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-2">{consultorio.direccion}</span>
                    </div>
                )}

                {consultorio.telefono && (
                    <div className="flex items-center gap-2 text-slate-600 text-sm mt-2">
                        <svg className="w-4 h-4 flex-shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{consultorio.telefono}</span>
                    </div>
                )}

                {especialidades.length > 0 && (
                    <div className="mt-3">
                        <div className="flex flex-wrap gap-1.5">
                            {especialidades.slice(0, 3).map((esp, index) => (
                                <span key={index} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    {esp}
                                </span>
                            ))}
                            {especialidades.length > 3 && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    +{especialidades.length - 3} más
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {doctores.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {doctores.slice(0, 4).map((doctor) => (
                                    doctor.foto_url ? (
                                        <div key={doctor.id} className="relative w-7 h-7 rounded-full border-2 border-white overflow-hidden">
                                            <Image
                                                src={doctor.foto_url}
                                                alt={doctor.nombre_completo || ''}
                                                fill
                                                className="object-cover"
                                                sizes="28px"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            key={doctor.id}
                                            className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-white text-[10px] font-medium"
                                        >
                                            {doctor.nombre_completo?.split(' ').map(n => n[0]).slice(0, 2).join('') || '?'}
                                        </div>
                                    )
                                ))}
                                {doctores.length > 4 && (
                                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-medium">
                                        +{doctores.length - 4}
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-slate-500">
                                {doctores.length} {doctores.length === 1 ? 'doctor' : 'doctores'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Footer indicator */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <span className="text-xs text-cyan-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Ver más
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );

    const cardClasses = `
        group block
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm hover:shadow-xl
        transition-all duration-300
        overflow-hidden
        hover:border-cyan-300
        hover:-translate-y-1
        cursor-pointer
    `;

    // If verified, use Link to redirect
    if (isVerified) {
        return (
            <Link href={consultorio.slug ? `/consultorio/${consultorio.slug}` : '#'} className={cardClasses}>
                {cardContent}
            </Link>
        );
    }

    // If not verified, show modal on click
    return (
        <>
            <div
                className={cardClasses}
                onClick={() => setShowModal(true)}
            >
                {cardContent}
            </div>

            {showModal && (
                <ConsultorioModal
                    consultorio={consultorio}
                    especialidades={especialidades}
                    especialidadLabel={especialidadLabel}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
