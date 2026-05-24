import express from 'express';
import jwt from 'jsonwebtoken';
import clientPromise from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    return decoded.userId;
  } catch { return null; }
};

// Get user's order history
router.get('/history', async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
  const client = await clientPromise;
  const db = client.db('GroceryStore');
  const orders = await db.collection('orders').find({ user_id: new ObjectId(userId) }).sort({ created_at: -1 }).toArray();
  res.json({ success: true, orders });
});

// Create new order
router.post('/create', async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  
  const { items, total, paymentMethod, address } = req.body;
  const client = await clientPromise;
  const db = client.db('GroceryStore');
  
  const order = {
    user_id: new ObjectId(userId),
    items,
    total,
    paymentMethod,
    address,
    status: 'Confirmed',
    created_at: new Date(),
    estimated_delivery: new Date(Date.now() + 30 * 60000)
  };
  
  const result = await db.collection('orders').insertOne(order);
  res.json({ success: true, orderId: result.insertedId });
});

export default router;