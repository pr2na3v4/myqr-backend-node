require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Route Imports
const shopRoutes = require('./src/routes/shopRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const customerRoutes = require('./src/routes/customerRoutes');

const app = express();

// --- 1. Essential Global Middleware ---
// Order is critical: JSON parsing must happen BEFORE routes
app.use(helmet());           // Security headers
app.use(cors());             // Enable Cross-Origin Resource Sharing
app.use(morgan('dev'));      // HTTP request logging
app.use(express.json());
     // REQUIRED: Parses incoming JSON (fixes your 'destructure' error)
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// --- 2. Database Connection ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ Connected to MongoDB Atlas: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ DB Connection Error:', err.message);
    process.exit(1); // Exit process with failure
  }
};
connectDB();

// --- 3. Base Routes & Health Checks ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.send('Welcome to MYQR Backend API');
});

// --- 4. API Route Definitions ---
app.use('/api/shops', shopRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/customers', customerRoutes);

// --- 5. Global Error Handling (The Safety Net) ---
// This prevents the 500 "Internal Server Error" from crashing your terminal
app.use((err, req, res, next) => {
  console.error('🔥 Server Error Stack:', err.stack);
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: err.message || "An unexpected error occurred"
  });
});

// --- 6. Port & Server Start ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Node Server running on port ${PORT}`);
});

// Handle unhandled promise rejections (like DB connection drops)
process.on('unhandledRejection', (err) => {
  console.log('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});