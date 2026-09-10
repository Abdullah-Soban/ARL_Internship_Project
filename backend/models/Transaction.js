const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  txnId: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  supplier: { type: String, required: true },
  grade: { type: String, required: true },
  volume: { type: Number, required: true },
  unit: { type: String, default: 'Barrels' },
  pricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  
  // Three-Way Match Support
  poQuantity: { type: Number },
  receivedQuantity: { type: Number },
  invoiceQuantity: { type: Number },
  discrepancyStatus: { type: String, enum: ['MATCHED', 'DISCREPANCY', 'PENDING'], default: 'PENDING' },
  
  // Crude Quality Monitoring
  apiGravity: { type: Number },
  sulfurPercent: { type: Number },
  qualityStatus: { type: String, enum: ['ACCEPTED', 'WARNING', 'REJECTED'] },
  
  status: { 
    type: String, 
    enum: ['Completed', 'Processing', 'Pending Approval', 'Failed'],
    required: true 
  },
  location: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
