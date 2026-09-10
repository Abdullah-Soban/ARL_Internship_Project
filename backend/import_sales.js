const mongoose = require('mongoose');
const xlsx = require('xlsx');
const Sale = require('./models/Sale');

// Mock pricing for products (in USD per LTR for consistency with prototype)
const productPricing = {
  'HSD': { price: 1.20, margin: 0.12 }, // 12% profit margin
  'PMG': { price: 1.35, margin: 0.15 },
  'HOBC': { price: 1.50, margin: 0.18 },
  'JET A-1': { price: 1.10, margin: 0.10 },
  'DEFAULT': { price: 1.00, margin: 0.10 }
};

const importSalesData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/arl-oil-accounting');
    console.log('Connected to MongoDB');

    await Sale.deleteMany({});
    console.log('Cleared existing sales records');

    const filePath = 'c:/Users/03345/Desktop/ARL-Oil-Accounting System/sales_data.xlsx';
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const salesToInsert = rawData.map(row => {
      const productName = row.ARL_PRODUCT_NAME || 'Unknown';
      const pricing = productPricing[productName] || productPricing['DEFAULT'];
      
      const quantity = row.QUANTITY || 0;
      const pricePerUnit = pricing.price;
      const revenue = quantity * pricePerUnit;
      const profit = revenue * pricing.margin;
      const cost = revenue - profit;

      // Excel dates can be tricky, if DATETIME is a string we use it, otherwise fallback
      let dateVal = new Date();
      if (row.DATETIME) {
        dateVal = new Date(row.DATETIME);
      }

      return {
        voucherNo: row.ARL_VOUCHER_NO ? String(row.ARL_VOUCHER_NO) : `V-${Math.floor(Math.random()*10000)}`,
        date: dateVal,
        client: row.ARL_OMC_NAME || 'Unknown Client',
        product: productName,
        quantity: quantity,
        unit: row.ARL_UNIT || 'LTRS',
        transportType: row.TRANSPORT_TYPE || 'Unknown',
        tankNo: row.ARL_TANK_NO ? String(row.ARL_TANK_NO) : 'N/A',
        bowserNo: row.ARL_BOWSER_NO || 'N/A',
        pricePerUnit,
        revenue,
        cost,
        profit,
        status: row.IS_POSTED === 1 ? 'Posted' : 'Completed'
      };
    });

    await Sale.insertMany(salesToInsert);
    console.log(`Successfully imported ${salesToInsert.length} sales records!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importSalesData();
