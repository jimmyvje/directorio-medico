require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
// @ts-ignore
const { parse } = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    const csvPath = 'd:\\proyectos personales\\directorio-medico\\consultorios_ecuador_guayas_final_clean.csv';

    try {
        console.log('Reading CSV to identify records to delete...');
        const content = fs.readFileSync(csvPath, 'utf8');
        const records = parse(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            relax_column_count: true
        });

        const nombres = records.map(r => r['Nombre']).filter(n => n);
        console.log(`Found ${nombres.length} names in CSV.`);

        if (nombres.length === 0) {
            console.log('No records found to delete.');
            return;
        }

        // Delete in chunks to avoid query size limits
        const chunkSize = 50;
        let deletedListings = 0;
        let deletedConsultorios = 0;

        for (let i = 0; i < nombres.length; i += chunkSize) {
            const chunk = nombres.slice(i, i + chunkSize);

            // 1. Delete Query from Directory Listings
            // Only delete if created in the last 24 hours to be safe
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const { error: listError, count: listCount } = await supabase
                .from('directory_listings')
                .delete({ count: 'exact' })
                .in('nombre', chunk)
                .gt('created_at', yesterday.toISOString());

            if (listError) {
                console.error('Error deleting listings chunk:', listError.message);
            } else {
                deletedListings += listCount || 0;
            }

            // 2. Delete Query from Consultorios
            // Note: This relies on cascade delete usually, but if not set, we delete manually.
            // Assuming listings deleted first to avoid FK constraint issues if cascade isn't on listings->consultorios (usually it is reverse)
            // Wait, DirectoryListing -> Consultorio (FK is on DirectoryListing). So deleting Listing is verified.
            // Consutorio is parent. We need to delete Consultorio too.
            // Does deleting Consultorio delete Listing? Yes if cascade.
            // But let's delete Listings first just in case.

            const { error: consError, count: consCount } = await supabase
                .from('consultorios')
                .delete({ count: 'exact' })
                .in('nombre', chunk)
                .gt('created_at', yesterday.toISOString());

            if (consError) {
                console.error('Error deleting consultorios chunk:', consError.message);
            } else {
                deletedConsultorios += consCount || 0;
            }

            process.stdout.write('.');
        }

        console.log(`\nRollback complete.`);
        console.log(`Deleted Directory Listings: ${deletedListings}`);
        console.log(`Deleted Consultorios: ${deletedConsultorios}`);

    } catch (e) {
        console.error('Error during rollback:', e);
    }
}

main();
