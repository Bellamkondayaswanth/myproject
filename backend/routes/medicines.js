const router = require('express').Router();
const Medicine = require('../models/Medicine');
const { protect, adminOnly } = require('../middleware/auth');

// Get all medicines (public)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    const medicines = await Medicine.find(filter).sort({ name: 1 });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single medicine
router.get('/:id', async (req, res) => {
  try {
    const med = await Medicine.findById(req.params.id);
    if (!med) return res.status(404).json({ message: 'Medicine not found' });
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add medicine (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const med = await Medicine.create(req.body);
    res.status(201).json(med);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update medicine (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!med) return res.status(404).json({ message: 'Medicine not found' });
    res.json(med);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete medicine (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;