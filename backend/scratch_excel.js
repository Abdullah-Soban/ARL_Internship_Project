const xlsx = require('xlsx');

const filePath = 'c:/Users/03345/Desktop/ARL-Oil-Accounting System/sales_data.xlsx';
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

console.log(`Total records: ${data.length}`);
if (data.length > 0) {
  console.log("Sample Record:");
  console.log(data[0]);
}
