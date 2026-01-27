import Link from 'next/link';
import Image from 'next/image';
import { Consultorio } from '@/types/database';

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

export default function ConsultorioCard({ consultorio, doctores, especialidades, especialidadLabel, isVerified }: ConsultorioCardProps) {
    const tipoLabel = {
        'MEDICINA_GENERAL': 'Medicina General',
        'ODONTOLOGIA': 'Odontología',
        'MIXTO': 'Mixto',
    };

    return (
        <Link
            href={consultorio.slug ? `/consultorio/${consultorio.slug}` : '#'}
            className="
        group block
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm hover:shadow-xl
        transition-all duration-300
        overflow-hidden
        hover:border-cyan-300
        hover:-translate-y-1
      "
        >
            <div className="p-6">
                <div className="flex items-start gap-4">
                    {consultorio.logo_url ? (
                        <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                                src={consultorio.logo_url}
                                alt={consultorio.nombre}
                                fill
                                className="rounded-xl object-cover shadow-lg"
                                sizes="(max-width: 768px) 64px, 64px"
                            />
                        </div>
                    ) : (
                        <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg bg-gradient-to-br from-cyan-600 to-cyan-700"
                        >
                            {consultorio.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors truncate">
                            {consultorio.nombre}
                        </h3>

                        <div className="flex items-center gap-2 mt-1">
                            <span className="inline-block px-2.5 py-0.5 bg-cyan-100 text-cyan-700 text-xs font-medium rounded-full">
                                {especialidadLabel || tipoLabel[consultorio.tipo_consultorio] || consultorio.tipo_consultorio}
                            </span>
                            {isVerified && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Verificado
                                </span>
                            )}
                        </div>

                        {consultorio.direccion && (
                            <div className="mt-2 flex items-center gap-1.5 text-slate-500 text-sm">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="truncate">{consultorio.direccion}</span>
                            </div>
                        )}
                    </div>
                </div>

                {especialidades.length > 0 && (
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 mb-2">Especialidades disponibles:</p>
                        <div className="flex flex-wrap gap-1.5">
                            {especialidades.slice(0, 3).map((esp, index) => (
                                <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                                    {esp}
                                </span>
                            ))}
                            {especialidades.length > 3 && (
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                                    +{especialidades.length - 3} más
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {doctores.length > 0 && (
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 mb-2">
                            {doctores.length} {doctores.length === 1 ? 'doctor' : 'doctores'}
                        </p>
                        <div className="flex -space-x-2">
                            {doctores.slice(0, 4).map((doctor) => (
                                doctor.foto_url ? (
                                    <div key={doctor.id} className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                                        <Image
                                            src={doctor.foto_url}
                                            alt={doctor.nombre_completo || ''}
                                            fill
                                            className="object-cover"
                                            sizes="32px"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        key={doctor.id}
                                        className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-white text-xs font-medium"
                                    >
                                        {doctor.nombre_completo?.split(' ').map(n => n[0]).slice(0, 2).join('') || '?'}
                                    </div>
                                )
                            ))}
                            {doctores.length > 4 && (
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium">
                                    +{doctores.length - 4}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-slate-500">
                        {consultorio.telefono && (
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{consultorio.telefono}</span>
                            </div>
                        )}
                    </div>
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
