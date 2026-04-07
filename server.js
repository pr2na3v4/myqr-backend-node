require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const shopRoutes      = require('./src/routes/shopRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const customerRoutes  = require('./src/routes/customerRoutes');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PORT = parseInt(process.env.PORT, 10) || 5000;

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://business-paymentqr-generator.netlify.app',
];

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server / curl requests (no Origin header)
    if (!origin) return callback(null, true);

    if (!ALLOWED_ORIGINS.includes(origin)) {
      return callback(
        new Error(`CORS: origin '${origin}' is not allowed`),
        false
      );
    }

    return callback(null, true);
  },
  methods:        ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials:    true,
};

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const app = express();

// Security & logging
app.use(helmet());
app.use(morgan('dev'));

// CORS — single registration; preflight handled globally
app.use(cors(corsOptions));
app.options('/{*path}', cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get('/', (_req, res) => res.send('Welcome to MYQR Backend API'));

app.get('/health', (_req, res) =>
  res.status(200).json({ status: 'UP', timestamp: new Date() })
);

app.use('/api/shops',     shopRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/customers', customerRoutes);

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('🔥 Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    error:   'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

// ---------------------------------------------------------------------------
// Start — server only boots after DB is confirmed ready
// ---------------------------------------------------------------------------

connectDB().then(() => {
  const server = app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );

  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled rejection:', err.message);
    server.close(() => process.exit(1));
  });
});