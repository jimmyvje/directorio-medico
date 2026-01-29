// Tipos basados en el schema real de la base de datos

export interface Especialidad {
    id: string;
    nombre: string;
    codigo: string | null;
    icono: string | null;
    requiere_odontograma: boolean;
    created_at: string;
}

export interface Consultorio {
    id: string;
    created_at: string;
    nombre: string;
    direccion: string | null;
    duracion_cita_minutos: number;
    hora_apertura: string;
    hora_cierre: string;
    telefono: string | null;
    correo: string | null;
    color_tema: string;
    ruc: string | null;
    slug: string | null;
    logo_url: string | null;
    tipo_consultorio: 'MEDICINA_GENERAL' | 'ODONTOLOGIA' | 'MIXTO';
}

export interface Perfil {
    id: string;
    nombre_completo: string | null;
    rol: string;
    email: string | null;
    especialidad: string | null;
    consultorio_id: string | null;
    numero_resolucion: string | null;
    telefono: string | null;
    foto_url: string | null;
    especialidad_id: string | null;
}

export interface DirectoryListing {
    id: string;
    created_at: string;
    nombre: string;
    slug: string;
    direccion: string | null;
    telefono: string | null;
    foto_url: string | null;
    especialidad: string | null;
    ciudad: string;
    is_verified: boolean;
    consultorio_id: string | null;
    views_count: number;
    rating: number;
}

export interface ConsultorioConDoctores extends Consultorio {
    doctores: Perfil[];
    especialidades: string[];
}

export interface SearchIndexItem {
    id: string;
    source_type: 'CONSULTORIO' | 'LISTING';
    nombre: string;
    slug: string;
    direccion: string | null;
    telefono: string | null;
    logo_url: string | null;
    created_at: string;
    is_verified: boolean;
    especialidad_label: string | null;
    especialidad_ids: string[];
    doctores_data: any[]; // JSON
}
