import { supabase } from '@/lib/supabase';

export default async function sitemap() {
    const baseUrl = 'https://doctoresecuador.com';

    // Páginas estáticas
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/buscar`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contacto`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
    ];

    // Consultorios dinámicos
    const { data: consultorios } = await supabase
        .from('consultorios')
        .select('slug, created_at')
        .not('slug', 'is', null);

    const consultorioPages = (consultorios || []).map((c) => ({
        url: `${baseUrl}/consultorio/${c.slug}`,
        lastModified: new Date(c.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Doctores dinámicos
    const { data: doctores } = await supabase
        .from('perfiles')
        .select('slug, created_at')
        .eq('rol', 'DOCTOR')
        .not('slug', 'is', null);

    const doctorPages = (doctores || []).map((d) => ({
        url: `${baseUrl}/doctor/${d.slug}`,
        lastModified: new Date(d.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Especialidades (páginas de búsqueda)
    const { data: especialidades } = await supabase
        .from('especialidades')
        .select('id, nombre');

    const especialidadPages = (especialidades || []).map((e) => ({
        url: `${baseUrl}/buscar?especialidad=${e.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...staticPages, ...consultorioPages, ...doctorPages, ...especialidadPages];
}
