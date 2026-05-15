import express from 'express';
import jwt from 'jsonwebtoken';
import clientPromise from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], 'my_temp_secret_key_2026');
    return decoded.userId;
  } catch { return null; }
};

// Search products
router.get('/products', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, products: [] });
  
  const client = await clientPromise;
  const db = client.db('GroceryStore');
  
  const products = await db.collection('products').find({
    name: { $regex: q, $options: 'i' }
  }).toArray();
  
  // Save search history if user is logged in
  const userId = getUserIdFromToken(req);
  if (userId) {
    await db.collection('search_history').insertOne({
      user_id: new ObjectId(userId),
      query: q,
      searched_at: new Date()
    });
  }
  
  res.json({ success: true, products });
});

// Get user's search history
router.get('/history', async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.json({ success: true, history: [] });
  
  const client = await clientPromise;
  const db = client.db('GroceryStore');
  const history = await db.collection('search_history')
    .find({ user_id: new ObjectId(userId) })
    .sort({ searched_at: -1 })
    .limit(10)
    .toArray();
  
  res.json({ success: true, history });
});

export default router;