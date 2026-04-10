const router = require('express').Router();
const { sendOrderConfirmation, sendContactReply } = require('../utils/sendEmail');
const { protect } = require('../middleware/auth');

// Send order confirmation email
router.post('/order-confirmation', protect, async (req, res) => {
  try {
    const { order } = req.body;
    const user = req.user;

    await sendOrderConfirmation(
      user.email,
      user.name,
      {
        orderId: order.orderId,
        items: order.items,
        totalAmount: order.totalAmount,
        address: user.address || order.address || 'Address on file'
      }
    );

    res.json({ message: 'Order confirmation email sent!' });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ message: 'Email failed: ' + err.message });
  }
});

// Send contact form reply
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email required' });
    }

    await sendContactReply(email, name, subject, message);
    res.json({ message: 'Contact reply sent!' });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ message: 'Email failed: ' + err.message });
  }
});

module.exports = router;