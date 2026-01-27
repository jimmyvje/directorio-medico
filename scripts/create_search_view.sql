-- Create a specific type for the view if needed, or just cast in the view
-- We'll use a VIEW to aggregate data from consultorios and directory_listings

CREATE OR REPLACE VIEW public.search_index AS
WITH doctor_stats AS (
    SELECT 
        consultorio_id,
        count(*) as count,
        -- Get the first specialty found for display
        (array_agg(especialidad ORDER BY id))[1] as primary_specialty,
        -- Get all specialty IDs for filtering
        array_agg(especialidad_id) FILTER (WHERE especialidad_id IS NOT NULL) as especialidad_ids,
        -- JSON preview of doctors for UI
        json_agg(json_build_object(
            'id', id,
            'nombre_completo', nombre_completo,
            'foto_url', foto_url,
            'especialidad', especialidad
        )) as doctores
    FROM perfiles
    WHERE rol = 'DOCTOR'
    GROUP BY consultorio_id
)
SELECT
    c.id,
    'CONSULTORIO' as source_type,
    c.nombre,
    c.slug,
    c.direccion,
    c.logo_url,
    c.created_at,
    -- Verification logic: Linked listing is verified
    COALESCE(dl.is_verified, false) as is_verified,
    -- Specialty Label Logic
    COALESCE(
        -- 1. Explicit listing specialty (highest priority for independent docs)
        CASE WHEN ds.count IS NULL OR ds.count = 0 THEN dl.especialidad END,
        -- 2. First doctor specialty
        ds.primary_specialty,
        -- 3. Fallback type
        CASE c.tipo_consultorio
          WHEN 'MEDICINA_GENERAL' THEN 'Medicina General'
          WHEN 'ODONTOLOGIA' THEN 'Odontología'
          WHEN 'MIXTO' THEN 'Mixto'
          ELSE c.tipo_consultorio
        END
    ) as especialidad_label,
    -- Searchable/Filterable Specialty IDs
    COALESCE(ds.especialidad_ids, ARRAY[]::uuid[]) as especialidad_ids,
    -- Doctors Preview
    COALESCE(ds.doctores, '[]'::json) as doctores_data
FROM consultorios c
LEFT JOIN directory_listings dl ON dl.consultorio_id = c.id
LEFT JOIN doctor_stats ds ON ds.consultorio_id = c.id

UNION ALL

SELECT
    l.id,
    'LISTING' as source_type,
    l.nombre,
    l.slug,
    l.direccion,
    l.foto_url as logo_url,
    l.created_at,
    l.is_verified,
    l.especialidad as especialidad_label,
    ARRAY[]::uuid[] as especialidad_ids, -- No IDs for loose listings
    '[]'::json as doctores_data -- No doctors
FROM directory_listings l
WHERE l.consultorio_id IS NULL;

-- Permissions
ALTER VIEW public.search_index OWNER TO postgres;
GRANT SELECT ON public.search_index TO anon, authenticated, service_role;
