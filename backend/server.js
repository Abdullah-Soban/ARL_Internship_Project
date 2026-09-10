require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Transaction = require('./models/Transaction');
const Sale = require('./models/Sale');
const Exception = require('./models/Exception');
const Supplier = require('./models/Supplier');
const Customer = require('./models/Customer');
const Contract = require('./models/Contract');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arl-oil-accounting')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes

// 1. Get all transactions (with optional search/filter)
app.get('/api/transactions', async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = {};
    
    if (status && status !== 'All') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { txnId: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } }
      ];
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 2. Get specific transaction by ID
app.get('/api/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 3. Get summary statistics
app.get('/api/summary', async (req, res) => {
  try {
    const totalStats = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalExpenditure: { $sum: '$totalAmount' },
          totalVolume: { $sum: '$volume' },
        }
      }
    ]);

    const activeCount = await Transaction.countDocuments({ status: { $in: ['Processing', 'Pending Approval'] } });
    const completedCount = await Transaction.countDocuments({ status: 'Completed' });

    res.json({
      totalExpenditure: totalStats[0]?.totalExpenditure || 0,
      totalVolume: totalStats[0]?.totalVolume || 0,
      activeTransactions: activeCount,
      completedTransactions: completedCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 4. Get all sales
app.get('/api/sales', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 4b. Get sales summary statistics (Must be before /:id)
app.get('/api/sales/summary', async (req, res) => {
  try {
    const totalStats = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue' },
          totalProfit: { $sum: '$profit' },
          totalVolume: { $sum: '$quantity' },
        }
      }
    ]);
    
    // Group by Product
    const productStats = await Sale.aggregate([
      {
        $group: {
          _id: '$product',
          volume: { $sum: '$quantity' }
        }
      },
      { $sort: { volume: -1 } },
      { $limit: 3 }
    ]);

    const activeCount = await Sale.countDocuments({ status: { $in: ['Processing', 'Pending'] } });
    const completedCount = await Sale.countDocuments({ status: { $in: ['Completed', 'Posted'] } });

    res.json({
      totalRevenue: totalStats[0]?.totalRevenue || 0,
      totalProfit: totalStats[0]?.totalProfit || 0,
      totalVolume: totalStats[0]?.totalVolume || 0,
      activeTransactions: activeCount,
      completedTransactions: completedCount,
      topProducts: productStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 5. Get specific sale by ID
app.get('/api/sales/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// 6. AI Exception Analysis (Simulated)
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const data = req.body;
    const anomalies = [];
    
    const isSale = !!data.voucherNo;
    const id = isSale ? data.voucherNo : data.txnId;
    const partner = isSale ? data.client : data.supplier;
    const volume = isSale ? data.quantity : data.volume;
    
    // Complex AI Rules
    if (volume > 100000) anomalies.push(`Volume (${volume.toLocaleString()}) is unusually high. Review required.`);
    if (!isSale && data.pricePerUnit < 70) anomalies.push(`Price per unit ($${data.pricePerUnit}) is below market average.`);
    if (isSale && data.profit < 0) anomalies.push(`Negative profit detected for this dispatch. Check pricing.`);
    if (isSale && data.quantity > 55000) anomalies.push(`Quantity (${data.quantity}) exceeds standard Tank Lorry capacity. Check dispatch logs.`);
    if (data.status === 'Failed') anomalies.push("Status is marked as 'Failed'. Investigate logistics.");

    let analysis = `**AI Analysis for ${id}**\n\n`;
    analysis += `I have reviewed this ${isSale ? 'sales dispatch' : 'procurement transaction'} for ${partner}. `;

    if (anomalies.length > 0) {
      analysis += `I detected **${anomalies.length} potential anomaly/risk factor(s)**:\n\n`;
      anomalies.forEach((a, i) => analysis += `${i+1}. ${a}\n`);
      analysis += `\n*Recommendation: Flag for manual managerial review.*`;
    } else {
      analysis += `No anomalies detected. The volume, pricing, and logistics fall within normal operational parameters.`;
    }

    res.json({ analysis, flagCount: anomalies.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating AI analysis' });
  }
});

// 7. Get Exceptions
app.get('/api/exceptions', async (req, res) => {
  try {
    const exceptions = await Exception.find().sort({ createdAt: -1 });
    res.json(exceptions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.put('/api/exceptions/:id', async (req, res) => {
  try {
    const exc = await Exception.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exc);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// 8. Get Suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ riskScore: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// 9. Get Customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ totalProfit: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// 10. Get Contracts
app.get('/api/contracts', async (req, res) => {
  try {
    const contracts = await Contract.find().sort({ startDate: -1 });
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// 11. Morning Brief Analytics
app.get('/api/analytics/morning-brief', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // In a real app we'd filter by today, but here we summarize total active system state
    const openExceptions = await Exception.countDocuments({ status: 'OPEN' });
    const suppliersAttention = await Supplier.countDocuments({ riskCategory: { $in: ['ATTENTION', 'HIGH_RISK'] } });
    const customersHold = await Customer.countDocuments({ status: 'CREDIT_HOLD' });
    
    const activeDispatches = await Sale.countDocuments({ status: { $in: ['Processing', 'Pending'] } });
    const pendingProcurements = await Transaction.countDocuments({ status: 'Processing' });
    
    res.json({
      openExceptions,
      suppliersAttention,
      customersHold,
      activeDispatches,
      pendingProcurements,
      message: `Operations are stable. ${openExceptions} transactions require managerial review. ${suppliersAttention} suppliers have delayed deliveries. ${customersHold} OMCs are approaching credit limits.`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
