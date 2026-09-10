const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // OMC Name
  creditLimit: { type: Number, required: true },
  outstandingAmount: { type: Number, default: 0 },
  
  // Analytics
  totalRevenue: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  marginPercent: { type: Number, default: 0 },
  
  status: { type: String, enum: ['ACTIVE', 'CREDIT_HOLD', 'INACTIVE'], default: 'ACTIVE' }
}, { timestamps: true });

// Virtual for available credit
customerSchema.virtual('availableCredit').get(function() {
  return Math.max(0, this.creditLimit - this.outstandingAmount);
});

customerSchema.virtual('creditUtilization').get(function() {
  if (this.creditLimit === 0) return 100;
  return ((this.outstandingAmount / this.creditLimit) * 100).toFixed(1);
});

customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Customer', customerSchema);
