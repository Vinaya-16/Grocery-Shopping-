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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

// GET WISHLIST
router.get('/', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const client = await clientPromise;
    const db = client.db('GroceryStore');

    const wishlist = await db.collection('wishlist_items')
      .aggregate([
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

            id: {
              $toString: '$_id'
            },

            product: {
              id: {
                $toString: '$product._id'
              },

              name: '$product.name',

              price: '$product.price',

              category: '$product.category',

              image_url: '$product.image_url',

              rating: '$product.rating'
            },

            added_at: 1
          }
        }
      ])
      .toArray();

    res.json({
      success: true,
      wishlist
    });

  } catch (error) {
    console.error('Get wishlist error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist'
    });
  }
});

// ADD TO WISHLIST
router.post('/add', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID required'
      });
    }

    const client = await clientPromise;
    const db = client.db('GroceryStore');

    // Check existing
    const existing = await db.collection('wishlist_items').findOne({
      user_id: new ObjectId(userId),
      product_id: new ObjectId(product_id)
    });

    if (existing) {
      return res.json({
        success: false,
        message: 'Already in wishlist'
      });
    }

    await db.collection('wishlist_items').insertOne({
      user_id: new ObjectId(userId),
      product_id: new ObjectId(product_id),
      added_at: new Date()
    });

    res.json({
      success: true,
      message: 'Added to wishlist'
    });

  } catch (error) {
    console.error('Add wishlist error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to add wishlist'
    });
  }
});

// REMOVE FROM WISHLIST
router.delete('/remove/:productId', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const { productId } = req.params;

    const client = await clientPromise;
    const db = client.db('GroceryStore');

    await db.collection('wishlist_items').deleteOne({
      user_id: new ObjectId(userId),
      product_id: new ObjectId(productId)
    });

    res.json({
      success: true,
      message: 'Removed from wishlist'
    });

  } catch (error) {
    console.error('Remove wishlist error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to remove wishlist'
    });
  }
});

export default router;