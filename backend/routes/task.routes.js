const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const Task = require('../models/Task');

// All routes are protected
router.use(authMiddleware);

// Validation middleware
const validateTask = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601().toDate()
];

// Create task
router.post('/', validateTask, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status = 'pending', priority = 'medium', dueDate } = req.body;

    const task = new Task({
      user: req.user.id,
      title,
      description,
      status,
      priority,
      dueDate
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all tasks with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, status, priority, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Build query
    const query = { user: req.user.id };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    // Build sort object
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortOrder };
    
    const tasks = await Task.find(query).sort(sortObj);
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.put('/:id', validateTask, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      {
        title,
        description,
        status,
        priority,
        dueDate
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid task ID' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;