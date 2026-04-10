const dns = require('node:dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces Google DNS to find MongoDB

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/email',     require('./routes/email'));
app.use('/api/dashboard', require('./routes/dashboard'));


app.get('/', (req, res) => res.json({ message: 'MediQuick API Running ✅' }));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB Error:', err.message));