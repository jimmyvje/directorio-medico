const fs = require('fs');
// @ts-ignore
const { parse } = require('csv-parse/sync');

const csvPath = 'd:\\proyectos personales\\directorio-medico\\consultorios_ecuador_guayas_final_clean.csv';

try {
    const content = fs.readFileSync(csvPath, 'utf8');
    const records = parse(content, {
        columns: true,
        to: 1,
        skip_empty_lines: true
    });
    console.log(JSON.stringify(Object.keys(records[0])));
} catch (e) {
    console.error(e.message);
}
