interface AdBannerProps {
    slot: 'header' | 'inline' | 'sidebar' | 'footer';
}

export default function AdBanner({ slot }: AdBannerProps) {
    const sizeClasses = {
        header: 'h-24',
        inline: 'h-28',
        sidebar: 'h-64',
        footer: 'h-24',
    };

    return (
        <div
            className={`
        ${sizeClasses[slot]}
        w-full
        flex items-center justify-center
      `}
        >
            {/* Espacio reservado para publicidad */}
        </div>
    );
}
