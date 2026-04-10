const router = require('express').Router();
const Medicine = require('../models/Medicine');
const { protect, adminOnly } = require('../middleware/auth');

// Get low stock alerts
router.get('/alerts', protect, adminOnly, async (req, res) => {
  try {
    const low = await Medicine.find({ $expr: { $lte: ['$stock', '$minStock'] } });
    res.json(low);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get expiring medicines (within 30 days)
router.get('/expiring', protect, adminOnly, async (req, res) => {
  try {
    const soon = new Date();
    soon.setDate(soon.getDate() + 30);
    const meds = await Medicine.find({ expiryDate: { $lte: soon, $gte: new Date() } });
    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Restock medicine
router.patch('/:id/restock', protect, adminOnly, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity <= 0)
      return res.status(400).json({ message: 'Positive quantity required' });
    const med = await Medicine.findByIdAndUpdate(
      req.params.id, { $inc: { stock: quantity } }, { new: true }
    );
    if (!med) return res.status(404).json({ message: 'Medicine not found' });
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;