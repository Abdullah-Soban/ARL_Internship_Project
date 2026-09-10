const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  contactPerson: { type: String },
  email: { type: String },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
  
  // Performance metrics (updated periodically)
  onTimeDeliveryPercent: { type: Number, default: 100 },
  qualityAcceptancePercent: { type: Number, default: 100 },
  quantityAccuracyPercent: { type: Number, default: 100 },
  
  // Risk Score (0-100)
  riskScore: { type: Number, default: 0 },
  riskCategory: { type: String, enum: ['EXCELLENT', 'GOOD', 'ATTENTION', 'HIGH_RISK'], default: 'EXCELLENT' },
  
  riskFactors: [{ type: String }], // Array of reasons explaining the risk score
  
  totalProcurementValue: { type: Number, default: 0 },
  activeIssues: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
