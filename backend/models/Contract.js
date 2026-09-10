const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  product: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  agreedVolume: { type: Number, required: true },
  agreedPrice: { type: Number, required: true }, // price per unit
  
  actualVolumeReceived: { type: Number, default: 0 },
  actualAveragePrice: { type: Number, default: 0 },
  
  status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'FULFILLED', 'BREACHED'], default: 'ACTIVE' }
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);
