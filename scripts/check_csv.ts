import fs from 'fs';
import { parse } from 'csv-parse/sync';

const csvPath = 'd:\\proyectos personales\\directorio-medico\\consultorios_ecuador_guayas_final_clean.csv';

try {
    const content = fs.readFileSync(csvPath, 'utf-8'); // Try utf-8
    const records = parse(content, {
        columns: true,
        to: 1 // Only header and first row
    });
    console.log('Headers (UTF-8):', Object.keys(records[0]));
} catch (e) {
    console.error('Error reading UTF-8:', e);
}

try {
    const content = fs.readFileSync(csvPath, 'latin1'); // Try latin1
    const records = parse(content, {
        columns: true,
        to: 1
    });
    console.log('Headers (Latin1):', Object.keys(records[0]));
} catch (e) {
    console.error('Error reading Latin1:', e);
}
