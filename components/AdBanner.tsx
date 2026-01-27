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
        bg-gradient-to-r from-slate-100 to-slate-50
        border border-slate-200 border-dashed
        rounded-xl
        flex items-center justify-center
        text-slate-400
        font-medium
        text-sm
      `}
        >
            <div className="text-center">
                <span className="text-lg">📢</span>
                <p>Espacio Publicitario - Google AdSense</p>
                <p className="text-xs text-slate-300">{slot.toUpperCase()}</p>
            </div>
        </div>
    );
}
