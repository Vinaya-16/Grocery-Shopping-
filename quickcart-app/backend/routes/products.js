import express from 'express';
import clientPromise from '../lib/mongodb.js';
import { ObjectId } from 'mongodb';
// import { reverse } from 'dns';

const router = express.Router();

const JWT_SECRET= process.env.JWT_SECRET;

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db('GroceryStore');
    
    const products = await db.collection('products').find({}).toArray();
    
    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      // stock_quantity: product.stock_quantity,
      stock: product.stock,
      rating: product.rating,
      reviews: product.reviews,
      unit: product.unit
    }));
    
    res.json({
      success: true,
      count: formattedProducts.length,
      products: formattedProducts
    });
  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const client = await clientPromise;
    const db = client.db('GroceryStore');
    
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product: {
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image_url: product.image_url,
        // stock_quantity: product.stock_quantity,
        stoock: product.stock,
        rating: product.rating,
        reviews: product.reviews,
        unit: product.unit
      }
    });
  } catch (error) {
    console.error('Product detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

export default router;