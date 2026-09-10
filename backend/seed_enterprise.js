const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transaction = require('./models/Transaction');
const Sale = require('./models/Sale');
const Supplier = require('./models/Supplier');
const Customer = require('./models/Customer');
const Contract = require('./models/Contract');
const Exception = require('./models/Exception');

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arl-oil-accounting';

async function seedEnterpriseData() {
  try {
    console.log('Connecting to MongoDB...', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    // Clear old seeded data
    await Supplier.deleteMany({});
    await Customer.deleteMany({});
    await Contract.deleteMany({});
    await Exception.deleteMany({});
    console.log('Cleared old enterprise models.');

    // 1. Seed Suppliers from Transactions
    const txns = await Transaction.find({});
    const supplierNames = [...new Set(txns.map(t => t.supplier))].filter(Boolean);
    
    for (const name of supplierNames) {
      const supplierTxns = txns.filter(t => t.supplier === name);
      const totalValue = supplierTxns.reduce((sum, t) => sum + t.totalAmount, 0);
      
      // Randomize risk
      const riskScore = Math.floor(Math.random() * 40); // 0-40 mostly
      let riskCategory = 'EXCELLENT';
      let riskFactors = [];
      if (riskScore > 30) {
        riskCategory = 'ATTENTION';
        riskFactors.push('Recent delayed delivery');
        riskFactors.push('Price 3% above contract average');
      }

      await Supplier.create({
        name,
        contactPerson: 'Account Manager',
        email: `contact@${name.replace(/\s+/g, '').toLowerCase()}.com`,
        onTimeDeliveryPercent: 100 - (Math.random() * 10),
        qualityAcceptancePercent: 100 - (Math.random() * 5),
        quantityAccuracyPercent: 100 - (Math.random() * 8),
        riskScore,
        riskCategory,
        riskFactors,
        totalProcurementValue: totalValue,
        activeIssues: riskScore > 30 ? 1 : 0
      });
      
      // Seed Contract for this supplier
      const product = supplierTxns[0].grade;
      const agreedVolume = 500000;
      const actualVolume = supplierTxns.reduce((sum, t) => sum + t.volume, 0);
      const avgPrice = supplierTxns.reduce((sum, t) => sum + t.pricePerUnit, 0) / supplierTxns.length;
      
      await Contract.create({
        supplierName: name,
        product,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        agreedVolume,
        agreedPrice: 78.50, // Approx assumed baseline
        actualVolumeReceived: actualVolume,
        actualAveragePrice: avgPrice,
        status: 'ACTIVE'
      });
    }
    console.log(`Seeded ${supplierNames.length} Suppliers and Contracts.`);

    // 2. Seed Customers from Sales
    const sales = await Sale.find({});
    const clientNames = [...new Set(sales.map(s => s.client))];
    
    for (const name of clientNames) {
      const clientSales = sales.filter(s => s.client === name);
      const totalRev = clientSales.reduce((sum, s) => sum + s.revenue, 0);
      const totalProf = clientSales.reduce((sum, s) => sum + s.profit, 0);
      const margin = (totalProf / totalRev) * 100;
      
      // Randomize credit utilization
      const creditLimit = Math.max(totalRev * 1.5, 5000000); 
      const outstanding = creditLimit * (Math.random() * 0.8 + 0.1); // 10% to 90% utilized

      await Customer.create({
        name,
        creditLimit,
        outstandingAmount: outstanding,
        totalRevenue: totalRev,
        totalProfit: totalProf,
        marginPercent: margin || 0,
        status: (outstanding / creditLimit) > 0.85 ? 'CREDIT_HOLD' : 'ACTIVE'
      });
    }
    console.log(`Seeded ${clientNames.length} Customers.`);

    // 3. Enhance Transactions for Three-Way Match & Quality
    for (const txn of txns) {
      // 90% match, 10% discrepancy
      const isDiscrepancy = Math.random() > 0.9;
      
      txn.poQuantity = txn.volume;
      txn.receivedQuantity = isDiscrepancy ? txn.volume - Math.floor(Math.random() * 1000) : txn.volume;
      txn.invoiceQuantity = txn.volume;
      txn.discrepancyStatus = isDiscrepancy ? 'DISCREPANCY' : 'MATCHED';
      
      // Quality
      const isBadQuality = Math.random() > 0.95;
      txn.apiGravity = 33 + (Math.random() * 2 - 1); // 32-34
      txn.sulfurPercent = 1.5 + (Math.random() * 0.5); // 1.5 - 2.0
      
      if (isBadQuality) {
        txn.sulfurPercent = 2.8; // High sulfur
        txn.qualityStatus = 'WARNING';
      } else {
        txn.qualityStatus = 'ACCEPTED';
      }
      
      await txn.save();
      
      // Generate Exception if discrepancy or bad quality
      if (isDiscrepancy) {
        await Exception.create({
          referenceId: txn.txnId,
          type: 'Procurement',
          partner: txn.supplier,
          severity: 'HIGH',
          category: 'Three-Way Match',
          message: `PO Quantity (${txn.poQuantity}) does not match Received Quantity (${txn.receivedQuantity})`,
          details: { po: txn.poQuantity, received: txn.receivedQuantity, invoice: txn.invoiceQuantity },
          status: 'OPEN'
        });
      }
      if (isBadQuality) {
        await Exception.create({
          referenceId: txn.txnId,
          type: 'Procurement',
          partner: txn.supplier,
          severity: 'MEDIUM',
          category: 'Quality Control',
          message: `Sulfur content (${txn.sulfurPercent.toFixed(2)}%) exceeds acceptable limit (2.0%)`,
          details: { sulfur: txn.sulfurPercent, expectedMax: 2.0 },
          status: 'IN_REVIEW'
        });
      }
    }
    console.log('Updated Transactions with Three-Way Match & Quality metrics.');

    // 4. Generate Sales Exceptions (Credit/Capacity)
    for (const sale of sales) {
      const isOverCap = sale.quantity > 55000;
      if (isOverCap) {
        await Exception.create({
          referenceId: sale.voucherNo,
          type: 'Sales',
          partner: sale.client,
          severity: 'CRITICAL',
          category: 'Logistics',
          message: `Dispatch volume (${sale.quantity}) exceeds max tank lorry capacity (55,000L).`,
          details: { volume: sale.quantity, limit: 55000 },
          status: 'OPEN'
        });
      }
    }
    console.log('Generated Sales Exceptions.');

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding enterprise data:', err);
    process.exit(1);
  }
}

seedEnterpriseData();
