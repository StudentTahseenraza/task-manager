const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// MongoDB connection
const connectDB = require('./config/database');
connectDB();

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const taskRoutes = require('./routes/task.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/me', profileRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});