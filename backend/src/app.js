const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middlewares/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const investmentRoutes = require('./routes/investment.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const referralRoutes = require('./routes/referral.routes');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100 // 100 requests per window
});
app.use('/api', limiter);

// Body parser
app.use(express.json());

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/referrals', referralRoutes);

// Root endpoint for testing
app.get('/', (req, res) => res.send('API is running...'));

// Error handling middleware
app.use(errorHandler);

module.exports = app;
