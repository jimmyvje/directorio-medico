'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

interface PaginationProps {
    totalPages: number;
}

export default function Pagination({ totalPages }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
                {/* Previous Button */}
                <Link
                    href={createPageURL(currentPage - 1)}
                    className={`px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium transition-colors ${currentPage <= 1
                        ? 'pointer-events-none text-slate-300 bg-slate-50'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-cyan-700'
                        }`}
                    aria-disabled={currentPage <= 1}
                    tabIndex={currentPage <= 1 ? -1 : undefined}
                >
                    <span className="sr-only">Anterior</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>

                {/* Page Numbers - Limited logic for simplicity (show first, last, current, neighbors) */}
                {/* Simple version: Show current and neighbors */}
                {currentPage > 2 && (
                    <Link
                        href={createPageURL(1)}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-cyan-700 transition-colors"
                    >
                        1
                    </Link>
                )}

                {currentPage > 3 && <span className="px-2 text-slate-400">...</span>}

                {currentPage > 1 && (
                    <Link
                        href={createPageURL(currentPage - 1)}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-cyan-700 transition-colors"
                    >
                        {currentPage - 1}
                    </Link>
                )}

                <span className="px-3 py-2 rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-700 text-sm font-medium">
                    {currentPage}
                </span>

                {currentPage < totalPages && (
                    <Link
                        href={createPageURL(currentPage + 1)}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-cyan-700 transition-colors"
                    >
                        {currentPage + 1}
                    </Link>
                )}

                {currentPage < totalPages - 2 && <span className="px-2 text-slate-400">...</span>}

                {currentPage < totalPages - 1 && (
                    <Link
                        href={createPageURL(totalPages)}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-cyan-700 transition-colors"
                    >
                        {totalPages}
                    </Link>
                )}

                {/* Next Button */}
                <Link
                    href={createPageURL(currentPage + 1)}
                    className={`px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium transition-colors ${currentPage >= totalPages
                        ? 'pointer-events-none text-slate-300 bg-slate-50'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-cyan-700'
                        }`}
                    aria-disabled={currentPage >= totalPages}
                    tabIndex={currentPage >= totalPages ? -1 : undefined}
                >
                    <span className="sr-only">Siguiente</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </nav>
        </div>
    );
}
