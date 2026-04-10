const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderConfirmation = async (toEmail, userName, order) => {
  const itemsList = order.items.map(item =>
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${item.price * item.quantity}</td>
    </tr>`
  ).join('');

  const mailOptions = {
    from: `"MediQuick" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Order Confirmed #${order.orderId} - MediQuick 🎉`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0a6e4f;padding:30px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0;font-size:28px">MediQuick</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Your trusted online pharmacy</p>
        </div>

        <div style="background:white;padding:30px;border:1px solid #e2e8f0">
          <h2 style="color:#0a6e4f">Order Confirmed! 🎉</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Your order has been placed successfully and will be delivered in <strong>30 minutes</strong>.</p>

          <div style="background:#f8faf9;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:0;font-size:14px;color:#64748b">Order ID</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0a6e4f">#${order.orderId}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin:20px 0">
            <thead>
              <tr style="background:#f8faf9">
                <th style="padding:10px 8px;text-align:left;font-size:13px;color:#64748b">Medicine</th>
                <th style="padding:10px 8px;text-align:center;font-size:13px;color:#64748b">Qty</th>
                <th style="padding:10px 8px;text-align:right;font-size:13px;color:#64748b">Price</th>
              </tr>
            </thead>
            <tbody>${itemsList}</tbody>
          </table>

          <div style="border-top:2px solid #0a6e4f;padding-top:16px;text-align:right">
            <p style="font-size:18px;font-weight:700;color:#0a6e4f;margin:0">Total: ₹${order.totalAmount}</p>
          </div>

          <div style="background:#e6f4ef;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:0;color:#0a6e4f;font-weight:600">📍 Delivery Address</p>
            <p style="margin:4px 0 0;color:#1a1a2e">${order.address || 'Address on file'}</p>
          </div>

          <p style="color:#64748b;font-size:14px">
            Need help? Contact us at <a href="mailto:support@mediquick.in" style="color:#0a6e4f">support@mediquick.in</a>
          </p>
        </div>

        <div style="background:#1a1a2e;padding:20px;text-align:center;border-radius:0 0 12px 12px">
          <p style="color:rgba(255,255,255,0.6);margin:0;font-size:13px">© 2025 MediQuick. All rights reserved.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendContactReply = async (toEmail, userName, subject, message) => {
  const mailOptions = {
    from: `"MediQuick Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'We received your message - MediQuick',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0a6e4f;padding:30px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:white;margin:0">MediQuick</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Your trusted online pharmacy</p>
        </div>

        <div style="background:white;padding:30px;border:1px solid #e2e8f0">
          <h2 style="color:#0a6e4f">We got your message! 📬</h2>
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Thank you for contacting MediQuick. We received your message about <strong>"${subject}"</strong>.</p>

          <div style="background:#f8faf9;border-radius:8px;padding:16px;margin:16px 0;border-left:4px solid #0a6e4f">
            <p style="margin:0;color:#64748b;font-style:italic">"${message}"</p>
          </div>

          <p>Our team will get back to you within <strong>24 hours</strong>.</p>
          <p style="color:#64748b;font-size:14px">
            For urgent medicine orders call us at <strong>+91 98765 43210</strong>
          </p>
        </div>

        <div style="background:#1a1a2e;padding:20px;text-align:center;border-radius:0 0 12px 12px">
          <p style="color:rgba(255,255,255,0.6);margin:0;font-size:13px">© 2025 MediQuick. All rights reserved.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderConfirmation, sendContactReply };