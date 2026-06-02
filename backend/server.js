require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// Connect to Database
connectDB();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Debug logging for request bodies
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log(`[${req.method}] ${req.path}`, req.body);
  }
  next();
});

// Socket.io initialization
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/deals', require('./routes/dealRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/accounts', require('./routes/accountRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/calls', require('./routes/callRoutes'));
app.use('/api/quotes', require('./routes/quoteRoutes'));
app.use('/api/solutions', require('./routes/solutionRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/rag', require('./routes/ragRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/kpi', require('./routes/kpiRoutes'));

app.get('/', (req, res) => {
  res.send('AI Business CRM API is running...');
});

// Error Handling Middleware
const fs = require('fs');
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const errorLog = `[${new Date().toISOString()}] ${err.message}\n${err.stack}\n\n`;
  try {
    fs.appendFileSync('error_log.txt', errorLog);
  } catch (logErr) {
    console.error('Failed to write to log file');
  }

  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  if (err.errors) console.error('Validation Errors:', err.errors);

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// Start background cron jobs
const { startReminderCron } = require('./cron/reminderCron');
startReminderCron();

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
