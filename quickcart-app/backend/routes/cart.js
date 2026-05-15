import express from 'express';
import jwt from 'jsonwebtoken';
import clientPromise from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Get user ID from token
const getUserIdFromToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'my_temp_secret_key_2026');
    return decoded.userId;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
};

// GET USER CART
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or missing token'
      });
    }

    const client = await clientPromise;
    const db = client.db('GroceryStore');

    const cartItems = await db.collection('cart_items').aggregate([
      {
        $match: {
          user_id: new ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          _id: 0,

          id: { $toString: '$_id' },

          quantity: 1,

          product: {
            id: { $toString: '$product._id' },
            name: '$product.name',
            price: '$product.price',
            image_url: '$product.image_url',
            category: '$product.category'
          },

          subtotal: {
            $multiply: ['$quantity', '$product.price']
          }
        }
      }
    ]).toArray();

    const total = cartItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    res.json({
      success: true,
      cart: cartItems,
      total,
      itemCount: cartItems.length
    });

  } catch (error) {
    console.error('Get cart error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
});

// ADD TO CART
router.post('/add', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or missing token'
      });
    }

    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity required'
      });
    }

    const client = await clientPromise;
    const db = client.db('GroceryStore');

    // Check if product exists
    const product = await db.collection('products').findOne({
      _id: new ObjectId(product_id)
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if already exists in cart
    const existing = await db.collection('cart_items').findOne({
      user_id: new ObjectId(userId),
      product_id: new ObjectId(product_id)
    });

    if (existing) {

      await db.collection('cart_items').updateOne(
        { _id: existing._id },
        {
          $set: {
            quantity: existing.quantity + quantity
          }
        }
      );

    } else {

      await db.collection('cart_items').insertOne({
        user_id: new ObjectId(userId),
        product_id: new ObjectId(product_id),
        quantity,
        added_at: new Date()
      });

    }

    res.json({
      success: true,
      message: 'Item added to cart'
    });

  } catch (error) {
    console.error('Add to cart error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to add item',
      error: error.message
    });
  }
});

// REMOVE ITEM
router.delete('/remove/:itemId', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or missing token'
      });
    }

    const { itemId } = req.params;

    const client = await clientPromise;
    const db = client.db('GroceryStore');

    const result = await db.collection('cart_items').deleteOne({
      _id: new ObjectId(itemId),
      user_id: new ObjectId(userId)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item removed'
    });

  } catch (error) {
    console.error('Remove cart error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: error.message
    });
  }
});

export default router;