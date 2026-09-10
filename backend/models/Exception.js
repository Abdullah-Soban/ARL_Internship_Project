const mongoose = require('mongoose');

const exceptionSchema = new mongoose.Schema({
  referenceId: { type: String, required: true }, // The txnId or voucherNo
  type: { type: String, required: true }, // 'Procurement' or 'Sales'
  partner: { type: String, required: true }, // Supplier or OMC
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  category: { type: String, required: true }, // e.g., 'Pricing', 'Volume', 'Logistics', 'Quality'
  message: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed }, // Arbitrary JSON for details (e.g., expected vs actual)
  status: { type: String, enum: ['OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED'], default: 'OPEN' },
  actionTaken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Exception', exceptionSchema);
