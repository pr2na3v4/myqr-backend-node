require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
 

const shopRoutes = require('./src/routes/shopRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const customerRoutes = require('./src/routes/customerRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging requests

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ DB Connection Error:', err));

// Basic Health Check
app.get('/health', (req, res) => res.send('System Operational'));
app.get('/', (req, res) => res.send('Welcome to MYQR Backend API'));
// Route Imports (We will create these next)
app.use('/api/shops', shopRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Node Server running on port ${PORT}`));