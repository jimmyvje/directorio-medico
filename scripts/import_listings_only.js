require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
// @ts-ignore
const { parse } = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Tenta usar a service role key se disponivel via env var do sistema, senao anon
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function generateSlug(name) {
    return name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        + '-' + Math.random().toString(36).substring(2, 7);
}

async function main() {
    const csvPath = 'd:\\proyectos personales\\directorio-medico\\consultorios_ecuador_guayas_final_clean.csv';

    try {
        console.log('Reading CSV for import...');
        const content = fs.readFileSync(csvPath, 'utf8');
        const records = parse(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            relax_column_count: true
        });

        console.log(`Found ${records.length} records. Importing into directory_listings ONLY...`);
        let successCount = 0;
        let errorCount = 0;

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

            // Insert ONLY into directory_listings
            // consultorio_id will be NULL
            // is_verified is FALSE
            const { error: listError } = await supabase
                .from('directory_listings')
                .insert({
                    nombre: nombre,
                    slug: slug,
                    direccion: direccion,
                    telefono: telefono,
                    especialidad: especialidad,
                    ciudad: ciudad,
                    is_verified: false,
                    consultorio_id: null // Explicitly null
                });

            if (listError) {
                console.error(`Error creating listing '${nombre}':`, listError.message);
                errorCount++;
            } else {
                successCount++;
                if (successCount % 10 === 0) process.stdout.write('.');
            }
        }

        console.log(`\nImport complete. Success: ${successCount}, Errors: ${errorCount}`);

    } catch (e) {
        console.error('Fatal error:', e);
    }
}

main();
