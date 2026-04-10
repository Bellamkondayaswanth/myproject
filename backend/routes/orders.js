const router = require('express').Router();
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const { protect, adminOnly } = require('../middleware/auth');

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, paymentMethod, deliveryAddress, notes } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'No items in order' });

    let totalAmount = 0;
    const enrichedItems = [];

    for (const item of items) {
      const med = await Medicine.findById(item.medicine);
      if (!med) return res.status(404).json({ message: `Medicine not found` });
      if (med.stock < item.quantity)
        return res.status(400).json({ message: `Insufficient stock for ${med.name}` });

      const subtotal = med.price * item.quantity;
      totalAmount += subtotal;
      enrichedItems.push({
        medicine: med._id, name: med.name,
        quantity: item.quantity, unitPrice: med.price, subtotal
      });
      await Medicine.findByIdAndUpdate(
  med._id,
  { $inc: { stock: -item.quantity } }
);
    }

    const order = await Order.create({
      customer: req.user._id, items: enrichedItems,
      totalAmount, paymentMethod, deliveryAddress, notes,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get orders (admin = all, customer = own)
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { customer: req.user._id };
    const orders = await Order.find(filter)
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status (admin only)
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Get all orders (admin)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;