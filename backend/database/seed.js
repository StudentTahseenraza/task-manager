const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create demo user
    const demoUser = new User({
      email: 'demo@example.com',
      password: 'demo123',
      name: 'Demo User'
    });
    await demoUser.save();
    console.log('Demo user created');

    // Create sample tasks
    const sampleTasks = [
      {
        user: demoUser._id,
        title: 'Complete assignment',
        description: 'Finish the task manager project',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2024-12-15')
      },
      {
        user: demoUser._id,
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, fruits',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date('2024-12-10')
      },
      {
        user: demoUser._id,
        title: 'Schedule meeting',
        description: 'Team sync for Q4 planning',
        status: 'completed',
        priority: 'low',
        dueDate: new Date('2024-12-05')
      },
      {
        user: demoUser._id,
        title: 'Update documentation',
        description: 'Add new API endpoints to docs',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date('2024-12-20')
      },
      {
        user: demoUser._id,
        title: 'Fix login bug',
        description: 'Investigate authentication issue',
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date('2024-12-12')
      }
    ];

    await Task.insertMany(sampleTasks);
    console.log('Sample tasks created');

    console.log('\nDemo Credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: demo123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();