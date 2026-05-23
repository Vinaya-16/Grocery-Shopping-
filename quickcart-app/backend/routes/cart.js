import express from 'express';
import jwt from 'jsonwebtoken';
import clientPromise from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';

const router = express.Router();


// GET USER ID FROM TOKEN
const getUserIdFromToken = (req) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {

    const decoded = jwt.verify(
      token,
      'my_temp_secret_key_2026'
    );

    return decoded.userId;

  } catch (error) {

    console.error('Token verification failed');

    return null;
  }
};


// GET CART
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

    const cartItems = await db.collection('cart_items')
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

            // CART ITEM ID
            id: {
              $toString: '$_id'
            },

            quantity: 1,

            product: {

              // PRODUCT ID
              id: {
                $toString: '$product._id'
              },

              name: '$product.name',
              price: '$product.price',
              image_url: '$product.image_url',
              category: '$product.category',
              rating: '$product.rating',
              unit: '$product.unit',
              stock: '$product.stock'
            },

            subtotal: {
              $multiply: [
                '$quantity',
                '$product.price'
              ]
            }
          }
        }
      ])
      .toArray();

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
      message: 'Failed to fetch cart'
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
        message: 'Unauthorized'
      });
    }

    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity required'
      });
    }

    const client = await clientPromise;
    const db = client.db('GroceryStore');

    // FIND PRODUCT
    const product = await db.collection('products').findOne({
      _id: new ObjectId(product_id)
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // CHECK EXISTING ITEM
    const existing = await db.collection('cart_items').findOne({
      user_id: new ObjectId(userId),
      product_id: new ObjectId(product_id)
    });

    // IF ALREADY EXISTS
    if (existing) {

      const updatedQuantity =
        existing.quantity + quantity;

      // STOCK CHECK
      if (updatedQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: 'Stock limit reached'
        });
      }

      await db.collection('cart_items').updateOne(
        {
          _id: existing._id
        },
        {
          $set: {
            quantity: updatedQuantity
          }
        }
      );

    } else {

      // STOCK CHECK
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: 'Stock limit reached'
        });
      }

      // INSERT NEW
      await db.collection('cart_items').insertOne({

        user_id: new ObjectId(userId),

        product_id: new ObjectId(product_id),

        quantity: quantity,

        added_at: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Added to cart'
    });

  } catch (error) {

    console.error('Add cart error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to add cart'
    });
  }
});


// UPDATE QUANTITY
router.put('/update/:itemId', async (req, res) => {

  try {

    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({
        success: false
      });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    const client = await clientPromise;
    const db = client.db('GroceryStore');

    // GET CURRENT ITEM
    const cartItem = await db.collection('cart_items').findOne({
      _id: new ObjectId(itemId),
      user_id: new ObjectId(userId)
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    // GET PRODUCT
    const product = await db.collection('products').findOne({
      _id: cartItem.product_id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // DELETE IF 0
    if (quantity <= 0) {

      await db.collection('cart_items').deleteOne({
        _id: new ObjectId(itemId),
        user_id: new ObjectId(userId)
      });

      return res.json({
        success: true,
        removed: true
      });
    }

    // STOCK CHECK
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: 'Stock limit reached'
      });
    }

    // UPDATE
    await db.collection('cart_items').updateOne(
      {
        _id: new ObjectId(itemId),
        user_id: new ObjectId(userId)
      },
      {
        $set: {
          quantity
        }
      }
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error('Update cart error:', error);

    res.status(500).json({
      success: false
    });
  }
});


// REMOVE ITEM
router.delete('/remove/:itemId', async (req, res) => {

  try {

    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({
        success: false
      });
    }

    const { itemId } = req.params;

    const client = await clientPromise;
    const db = client.db('GroceryStore');

    await db.collection('cart_items').deleteOne({
      _id: new ObjectId(itemId),
      user_id: new ObjectId(userId)
    });

    res.json({
      success: true,
      message: 'Item removed'
    });

  } catch (error) {

    console.error('Remove cart error:', error);

    res.status(500).json({
      success: false
    });
  }
});


export default router;