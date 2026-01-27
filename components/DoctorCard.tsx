import Link from 'next/link';
import Image from 'next/image';
import { DirectoryListing } from '@/types/database';

interface DoctorCardProps {
    doctor: DirectoryListing;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
    return (
        <Link
            href={`/doctor/${doctor.slug}`}
            className="
        group block
        bg-white dark:bg-slate-900
        rounded-2xl
        border border-slate-200 dark:border-slate-800
        shadow-sm hover:shadow-xl
        transition-all duration-300
        overflow-hidden
        hover:border-blue-300 dark:hover:border-blue-700
        hover:-translate-y-1
      "
        >
            <div className="p-6">
                {/* Header with Avatar and Verified Badge */}
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    {doctor.foto_url ? (
                        <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                                src={doctor.foto_url}
                                alt={doctor.nombre}
                                fill
                                className="rounded-full object-cover shadow-lg"
                                sizes="(max-width: 768px) 64px, 64px"
                            />
                        </div>
                    ) : (
                        <div className="
              w-16 h-16 rounded-full
              bg-gradient-to-br from-blue-500 to-indigo-600
              flex items-center justify-center
              text-white text-xl font-bold
              flex-shrink-0
              shadow-lg
            ">
                            {doctor.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        {/* Name and Verified Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="
                text-lg font-semibold text-slate-900 dark:text-white
                group-hover:text-blue-600 dark:group-hover:text-blue-400
                transition-colors truncate
              ">
                                {doctor.nombre}
                            </h3>
                            {doctor.is_verified && (
                                <span className="
                  inline-flex items-center gap-1
                  px-2.5 py-0.5
                  bg-emerald-100 dark:bg-emerald-900/30
                  text-emerald-700 dark:text-emerald-400
                  text-xs font-medium
                  rounded-full
                ">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verificado
                                </span>
                            )}
                        </div>

                        {/* Specialty */}
                        {doctor.especialidad && (
                            <p className="
                mt-1 text-blue-600 dark:text-blue-400
                font-medium text-sm
              ">
                                {doctor.especialidad}
                            </p>
                        )}

                        {/* City */}
                        {doctor.ciudad && (
                            <div className="mt-2 flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {doctor.ciudad}
                            </div>
                        )}
                    </div>
                </div>

                {/* Rating if available */}
                {doctor.rating > 0 && (
                    <div className="mt-3 flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{doctor.rating.toFixed(1)}</span>
                    </div>
                )}

                {/* CTA Arrow */}
                <div className="
           mt-4 pt-4
           border-t border-slate-100 dark:border-slate-800
           flex items-center justify-between
         ">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        {doctor.is_verified ? 'Agenda online disponible' : 'Ver perfil'}
                    </span>
                    <svg
                        className="
               w-5 h-5 text-slate-400
               group-hover:text-blue-600 dark:group-hover:text-blue-400
               group-hover:translate-x-1
               transition-all
             "
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
