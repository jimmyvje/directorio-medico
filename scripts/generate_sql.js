const fs = require('fs');
// @ts-ignore
const { parse } = require('csv-parse/sync');

function escapeSql(str) {
    if (!str) return 'NULL';
    // Escape single quotes for SQL
    return "'" + str.replace(/'/g, "''") + "'";
}

function generateSlug(name) {
    const slug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    // Add random suffix in JS not ideal for pure deterministic SQL, but fine here
    return slug + '-' + Math.random().toString(36).substring(2, 7);
}

const csvPath = 'd:\\proyectos personales\\directorio-medico\\consultorios_ecuador_guayas_final_clean.csv';

try {
    const content = fs.readFileSync(csvPath, 'utf8');
    const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true
    });

    console.log(`Generating SQL for ${records.length} records...`);

    let sqlContent = `-- Migration: Import Ecuador Listings (Unverified)
-- Generated automatically

`;

    for (const record of records) {
        const nombre = record['Nombre'];
        if (!nombre) continue;

        const direccion = record['Dirección'] || '';
        const ciudad = record['Ciudad'] || 'General';
        const telefono = record['Telefono'] || '';
        let especialidad = null;

        if (record['Especialidades']) {
            try {
                let jsonString = record['Especialidades'].replace(/'/g, '"');
                const espArray = JSON.parse(jsonString);
                if (Array.isArray(espArray) && espArray.length > 0) {
                    especialidad = espArray[0];
                }
            } catch (e) {
                especialidad = record['Especialidades'];
            }
        }

        const slug = generateSlug(nombre);

        const values = [
            escapeSql(nombre),
            escapeSql(slug),
            escapeSql(direccion),
            escapeSql(telefono),
            escapeSql(especialidad),
            escapeSql(ciudad),
            'false', // is_verified
            'NULL'   // consultorio_id
        ];

        sqlContent += `INSERT INTO public.directory_listings (nombre, slug, direccion, telefono, especialidad, ciudad, is_verified, consultorio_id) VALUES (${values.join(', ')});\n`;
    }

    fs.writeFileSync('d:\\proyectos personales\\directorio-medico\\scripts\\migration.sql', sqlContent);
    console.log('Migration file created at scripts/migration.sql');

} catch (e) {
    console.error('Error generating SQL:', e);
}
