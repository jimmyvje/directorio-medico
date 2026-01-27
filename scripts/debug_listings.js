const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env vars
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
// Try to use service role key if available for full access, otherwise anon
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkListings() {
    console.log('Checking directory_listings table...');

    // 1. Check total count
    const { count, error: countError } = await supabase
        .from('directory_listings')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error counting listings:', countError);
    } else {
        console.log(`Total listings: ${count}`);
    }

    // 2. Check standalone listings (consultorio_id is null)
    const { data: standalone, error: standaloneError } = await supabase
        .from('directory_listings')
        .select('id, nombre, is_verified')
        .is('consultorio_id', null)
        .limit(5);

    if (standaloneError) {
        console.error('Error fetching standalone listings:', standaloneError);
    } else {
        console.log(`Standalone listings found (sample 5):`, standalone);
    }

    // 3. Check verified listings
    const { data: verified, error: verifiedError } = await supabase
        .from('directory_listings')
        .select('id, nombre, is_verified, consultorio_id')
        .eq('is_verified', true)
        .limit(5);

    if (verifiedError) {
        console.error('Error fetching verified listings:', verifiedError);
    } else {
        console.log(`Verified listings found (sample 5):`, verified);
    }

    // 4. Check relation query (simulate app logic)
    // Get a consultorio ID that exists
    const { data: consultorios } = await supabase.from('consultorios').select('id, nombre').limit(1);
    if (consultorios && consultorios.length > 0) {
        const c = consultorios[0];
        console.log(`Checking relation for consultorio: ${c.nombre} (${c.id})`);
        const { data: relData, error: relError } = await supabase
            .from('consultorios')
            .select('*, directory_listings(*)')
            .eq('id', c.id)
            .single();

        if (relError) {
            console.error('Error fetching relation:', relError);
        } else {
            console.log('Relation data:', JSON.stringify(relData.directory_listings, null, 2));
        }
    }
}

checkListings();
