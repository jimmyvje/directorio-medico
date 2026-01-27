require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
// @ts-ignore
const { parse } = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer service role key if available for bypassing RLS, otherwise fallback to anon (might fail if RLS is strict)
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env.local');
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
        const content = fs.readFileSync(csvPath, 'utf8');
        const records = parse(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            relax_column_count: true
        });

        console.log(`Found ${records.length} records. Starting import...`);
        let successCount = 0;
        let errorCount = 0;

        for (const record of records) {
            const nombre = record['Nombre'];
            if (!nombre) continue;

            const direccion = record['Dirección'] || '';
            const ciudad = record['Ciudad'] || 'General';
            const telefono = record['Telefono'] || '';
            let especialidad = null;

            // Parse especialidades JSON like '["Dentista"]'
            if (record['Especialidades']) {
                try {
                    // Replace single quotes with double quotes if needed, though csv usually has standard JSON
                    // Python export might produce ['item']. JS needs ["item"].
                    let jsonString = record['Especialidades'].replace(/'/g, '"');
                    const espArray = JSON.parse(jsonString);
                    if (Array.isArray(espArray) && espArray.length > 0) {
                        especialidad = espArray[0];
                    }
                } catch (e) {
                    especialidad = record['Especialidades']; // Fallback as raw string
                }
            }

            const slug = generateSlug(nombre);

            // 1. Insert Consultorio
            const { data: consultorio, error: consError } = await supabase
                .from('consultorios')
                .insert({
                    nombre: nombre,
                    direccion: direccion,
                    telefono: telefono,
                    slug: slug,
                    tipo_consultorio: 'MEDICINA_GENERAL' // Default category
                })
                .select('id')
                .single();

            if (consError) {
                console.error(`Error creating consultorio '${nombre}':`, consError.message);
                console.error('Full Error:', consError); // Show full error object
                process.exit(1); // Stop debugging
            }

            // 2. Insert Directory Listing
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
                    consultorio_id: consultorio.id
                });

            if (listError) {
                console.error(`Error creating listing '${nombre}':`, listError.message);
                console.error('Full Error:', listError);
                process.exit(1);
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
