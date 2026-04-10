const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  genericName: { type: String },
  category: {
  type: String,
  enum: [
  'Tablet', 'Syrup', 'Capsule', 'Injection', 'Cream', 'Drops',
  'Antibiotic', 'Vitamin', 'Painkiller',
  'Medical Device', 'Baby Care', 'Ayurvedic', 'Skincare', 'Other'
],
  default: 'Other'
},
  manufacturer:{ type: String },
  price:       { type: Number, required: true },
  stock:       { type: Number, required: true, default: 0 },
  minStock:    { type: Number, default: 10 },
  expiryDate:  { type: Date, required: true },
  batchNumber: { type: String },
  description: { type: String },
  requiresPrescription: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);