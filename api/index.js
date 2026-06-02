const dotenv = require('dotenv');
const path = require('path');

// Load env from backend directory
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('../backend/config/db');

const app = express();

// Connect to Database
let isConnected = false;
const ensureDbConnected = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(helmet());

// Ensure DB connection on every request
app.use(async (req, res, next) => {
  try {
    await ensureDbConnected();
    next();
  } catch (error) {
    console.error('DB Connection Error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/users', require('../backend/routes/userRoutes'));
app.use('/api/leads', require('../backend/routes/leadRoutes'));
app.use('/api/assignments', require('../backend/routes/assignmentRoutes'));
app.use('/api/deals', require('../backend/routes/dealRoutes'));
app.use('/api/tasks', require('../backend/routes/taskRoutes'));
app.use('/api/meetings', require('../backend/routes/meetingRoutes'));
app.use('/api/contacts', require('../backend/routes/contactRoutes'));
app.use('/api/accounts', require('../backend/routes/accountRoutes'));
app.use('/api/products', require('../backend/routes/productRoutes'));
app.use('/api/invoices', require('../backend/routes/invoiceRoutes'));
app.use('/api/cases', require('../backend/routes/caseRoutes'));
app.use('/api/calls', require('../backend/routes/callRoutes'));
app.use('/api/quotes', require('../backend/routes/quoteRoutes'));
app.use('/api/solutions', require('../backend/routes/solutionRoutes'));
app.use('/api/email', require('../backend/routes/emailRoutes'));
app.use('/api/analytics', require('../backend/routes/analyticsRoutes'));
app.use('/api/ai', require('../backend/routes/aiRoutes'));
app.use('/api/reports', require('../backend/routes/reportRoutes'));
app.use('/api/rag', require('../backend/routes/ragRoutes'));
app.use('/api/settings', require('../backend/routes/settingRoutes'));
app.use('/api/kpi', require('../backend/routes/kpiRoutes'));

app.get('/api', (req, res) => {
  res.json({ message: 'AI Business CRM API is running...' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
