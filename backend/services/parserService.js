import csvParser from 'csv-parser';
import { Readable } from 'stream';
import XLSX from 'xlsx';


export function excelToCSV(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_csv(firstSheet);
}

export async function parseCSV(input, isString = false) {
  return new Promise(async (resolve, reject) => {
    const results = [];
    
    let stream;
    if (isString) {
      stream = Readable.from([input]);
    } else {
      const fs = await import('fs');
      stream = fs.default.createReadStream(input);
    }
    
    stream
      .pipe(csvParser())
      .on('data', (data) => {
        // Only add non-empty rows (filter out rows where all values are empty)
        const hasData = Object.values(data).some(value => 
          value && value.toString().trim() !== ''
        );
        if (hasData) {
          results.push(data);
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
