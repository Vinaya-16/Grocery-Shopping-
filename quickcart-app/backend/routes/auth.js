import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '../lib/mongodb.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// ================= SIGNUP =================
router.post('/signup', async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email and password'
      });
    }

    const client = await clientPromise;
    const db = client.db('GroceryStore');

    const existingUser = await db.collection('users').findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      full_name,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      created_at: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    const token = jwt.sign(
      {
        userId: result.insertedId.toString(),
        email: email.toLowerCase()
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: result.insertedId.toString(),
        full_name,
        email: email.toLowerCase()
      }
    });

  } catch (error) {
    console.error('Signup error:', error);

    res.status(500).json({
      success: false,
      message: 'Signup failed',
      error: error.message
    });
  }
});

// ================= LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const client = await clientPromise;
    const db = client.db('GroceryStore');

    const user = await db.collection('users').findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        full_name: user.full_name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

export default router;