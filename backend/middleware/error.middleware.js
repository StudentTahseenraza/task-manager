const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // JWT authentication error
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Database error
  if (err.code === '23505') { // Unique violation
    return res.status(400).json({ error: 'Duplicate entry' });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };