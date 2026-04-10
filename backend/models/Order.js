const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderItemSchema = new mongoose.Schema({
  medicine:  { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
  name:      { type: String, required: true },
  quantity:  { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  subtotal:  { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderId:       { type: String, default: () => 'MQ-' + uuidv4().slice(0,8).toUpperCase() },
  customer:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:         [orderItemSchema],
  totalAmount:   { type: Number, required: true },
  status:        { type: String,
                   enum: ['pending','confirmed','processing','delivered','cancelled'],
                   default: 'pending' },
  paymentMethod: { type: String, enum: ['cash','upi','online'], default: 'cash' },
  paymentStatus: { type: String, enum: ['unpaid','paid'], default: 'unpaid' },
  deliveryAddress: { type: String },
  notes:         { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);