const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  voucherNo: { type: String, required: true },
  date: { type: Date, required: true },
  client: { type: String, required: true }, // ARL_OMC_NAME
  product: { type: String, required: true }, // ARL_PRODUCT_NAME
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'LTRS' },
  transportType: { type: String },
  tankNo: { type: String },
  bowserNo: { type: String },
  
  // Generated Financials
  pricePerUnit: { type: Number, required: true },
  revenue: { type: Number, required: true },
  cost: { type: Number, required: true },
  profit: { type: Number, required: true },
  
  status: { type: String, default: 'Completed' }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
