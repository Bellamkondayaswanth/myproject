const router = require('express').Router();
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalMedicines = await Medicine.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    const lowStock = await Medicine.countDocuments({
      $expr: { $lte: ['$stock', '$minStock'] }
    });

    const soon = new Date();
    soon.setDate(soon.getDate() + 30);
    const expiringCount = await Medicine.countDocuments({
      expiryDate: { $lte: soon, $gte: new Date() }
    });

    // Revenue = sum of all PAID orders
    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Pending revenue = unpaid but delivered orders
    const pendingAgg = await Order.aggregate([
      { $match: { paymentStatus: 'unpaid', status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const pendingRevenue = pendingAgg[0]?.total || 0;

    // Orders by status count
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'name email');

    res.json({
      totalMedicines,
      totalOrders,
      totalUsers,
      lowStock,
      expiringCount,
      totalRevenue,
      pendingRevenue,
      ordersByStatus,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;