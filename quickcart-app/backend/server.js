import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import clientPromise from './lib/mongodb.js';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import cartRouter from './routes/cart.js';
import wishlistRouter from './routes/wishlist.js';
import ordersRouter from './routes/orders.js';
import searchRouter from './routes/search.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('GroceryStore');
    const productCount = await db.collection('products').countDocuments();
    const userCount = await db.collection('users').countDocuments();
    
    res.json({
      success: true,
      message: 'Backend is running!',
      database: 'GroceryStore',
      productCount: productCount,
      userCount: userCount
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Routes
app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/search', searchRouter);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📦 Health check: http://localhost:5000/api/health`);
  console.log(`🛒 Products API: http://localhost:5000/api/products`);
  console.log(`🔐 Auth API: http://localhost:5000/api/auth`);
  console.log(`🛍️ Cart API: http://localhost:5000/api/cart`);
});