import React, { useState, useEffect } from 'react';
import axios from 'axios';
import appleImg from '../assets/images/products/apple.jpg';
import milkImg from '../assets/images/products/milk.jpg';
import broccoliImg from '../assets/images/products/broccoli.jpg';
import carrotImg from '../assets/images/products/carrot.jpg';
import tomatoImg from '../assets/images/products/tomato.jpg';
import organgejuiceImg from '../assets/images/products/orange-juice.jpg';

const productImages = {
  'Fresh Apple': appleImg,
  'Amul Milk': milkImg,
  'Broccoli': broccoliImg,
  'Carrot': carrotImg,
  'Tomato': tomatoImg,
  'Orange Juice': organgejuiceImg,
};

// const products = [
//   { name: 'Apple 1kg', rating: 4.6, reviews: 130, price: 3.99, unit: 'kg', category: 'Fruits', image: appleImg },
//   { name: 'Whole Milk 1L', rating: 4.2, reviews: 150, price: 2.29, unit: 'L', category: 'Dairy', image: milkImg },
//   { name: 'Broccoli', rating: 4.3, reviews: 170, price: 1.99, unit: 'pc', category: 'Vegetables', image: broccoliImg },
//   { name: 'Carrot 1kg', rating: 4.4, reviews: 190, price: 1.49, unit: 'kg', category: 'Vegetables', image: carrotImg },
//   { name: 'Tomato 1kg', rating: 4.5, reviews: 210, price: 2.79, unit: 'kg', category: 'Vegetables', image: tomatoImg },
//   { name: 'Orange Juice 1L', rating: 4.6, reviews: 230, price: 3.29, unit: 'L', category: 'Beverages', image: organgejuiceImg },
// ];



function Home({ addToCart, addToFavourites, favourites }) {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.get(
        `${API_URL}/api/products`
      );

      if (response.data.success) {
        setProducts(response.data.products);
      }
    }
    catch (error) {
      console.error('Error fetching products: ', error);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const categories = [
    { name: 'All', icon: '📦' },
    { name: 'Fruits', icon: '🍎' },
    { name: 'Dairy', icon: '🥛' },
    { name: 'Beverages', icon: '🥤' },
    { name: 'Vegetables', icon: '🥦' }
  ];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="home-container">
      {/* Hero Section - Matches image_1f64d2.png */}
      <div className="hero">
        <div className="hero-content">
          <h1>Fresh Groceries Delivered in 30 Minutes</h1>
          <p>Shop farm-fresh fruits, vegetables, dairy and more.</p>
          <a href="#products" className="shop-now-btn">
            Shop Now <span>&rsaquo;</span>
          </a>
        </div>
      </div>

      {/* Weekly Offers Section - Matches image_1f6589.jpg */}
      <div className="offers-section">
        <h2 className="section-title">Weekly Offers</h2>
        <div className="offers-grid">
          <div className="offer-card orange-bg">
            <div className="offer-text">
              <span className="discount-tag">Up to 30% off</span>
              <h3>Fresh Vegetables</h3>
              <p>This week only</p>
            </div>
            <div className="offer-img-box">🥕</div>
          </div>
          <div className="offer-card green-bg">
            <div className="offer-text">
              <span className="discount-tag">Up to 35% off</span>
              <h3>Seasonal Fruits</h3>
              <p>Limited time</p>
            </div>
            <div className="offer-img-box">🍓</div>
          </div>
          <div className="offer-card blue-bg">
            <div className="offer-text">
              <span className="discount-tag">New Arrival</span>
              <h3>Fresh Dairy</h3>
              <p>Milk & Eggs</p>
            </div>
            <div className="offer-img-box">🥛</div>
          </div>
        </div>
      </div>

      {/* Categories - Matches image_1f6589.jpg pills */}
      <div className="categories-section">
        <h2 className="section-title">Categories</h2>
        <div className="categories-grid">
          {categories.map(cat => (
            <button
              key={cat.name}
              className={`category-pill ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <span className="pill-icon">{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Products - Matches image_1f6534.jpg */}
      <div id='products' className="products-section">
        <h2 className="section-title">Popular Products</h2>
        <div className="products-grid">

          {filteredProducts.map(product => {
            // Check if this product is already in the favourites list
            const isFavourite = favourites.some(fav => fav.name === product.name);

            return (
              <div key={product.id} className="product-card-modern">
                {/* Dynamic class and icon based on isFavourite */}
                <button
                  className={`wishlist-icon ${isFavourite ? 'liked' : ''}`}
                  onClick={() => addToFavourites(product)}
                >
                  {isFavourite ? '❤️' : '♡'}
                </button>

                <div className="product-image-wrap">
                  <img
                    src={`http://localhost:5000${product.image_url}`}
                    alt={product.name}
                    className="product-img-main"
                  />
                </div>

                <div className="product-details">
                  <h3 className="p-name">{product.name}</h3>
                  <div className="p-rating">⭐ {product.rating} <span>({product.reviews})</span></div>
                  <div className="p-price-row">
                    <span className="p-price">${product.price}<span>/{product.unit}</span></span>
                  </div>
                  <button className="add-to-cart-dark" onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}

        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section main-info">
            <div className="logo-white">🍃 QuickCart</div>
            <p>Fresh groceries delivered to your doorstep in 30 minutes.</p>
            <div className="social-icons"><span>f</span> <span>ig</span> <span>t</span></div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <p>About Us</p><p>Careers</p><p>Blog</p><p>Press</p>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <p>Help Center</p><p>FAQs</p><p>Terms of Service</p>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>📧 support@quickcart.com</p>
            <p>📞 +1 (800) 123-4567</p>
            <div className="store-badges">
              <span className="badge">App Store</span>
              <span className="badge">Google Play</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 QuickCart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;

// import React, { useState } from 'react';
// import appleImg from '../assets/images/products/apple.jpg';
// import milkImg from '../assets/images/products/milk.jpg';
// import broccoliImg from '../assets/images/products/broccoli.jpg';
// import carrotImg from '../assets/images/products/carrot.jpg';
// import tomatoImg from '../assets/images/products/tomato.jpg';
// import organgejuiceImg from '../assets/images/products/orange-juice.jpg';

// const products = [
//   // { name: 'Pineapple', rating: 4.2, reviews: 50, price: 3.49, unit: 'pc', category: 'Fruits', emoji: '🍍' },
//   // { name: 'Dragon Fruit', rating: 4.3, reviews: 70, price: 5.99, unit: 'pc', category: 'Fruits', emoji: '🐉' },
//   // { name: 'Strawberry 500g', rating: 4.4, reviews: 90, price: 4.49, unit: 'pc', category: 'Fruits', emoji: '🍓' },
//   // { name: 'Mango', rating: 4.5, reviews: 110, price: 2.49, unit: 'pc', category: 'Fruits', emoji: '🥭' },
//   { name: 'Apple 1kg', rating: 4.6, reviews: 130, price: 3.99, unit: 'kg', category: 'Fruits', image: appleImg },
//   { name: 'Whole Milk 1L', rating: 4.2, reviews: 150, price: 2.29, unit: 'L', category: 'Dairy', image: milkImg },
//   { name: 'Broccoli', rating: 4.3, reviews: 170, price: 1.99, unit: 'pc', category: 'Vegetables', image: broccoliImg },
//   { name: 'Carrot 1kg', rating: 4.4, reviews: 190, price: 1.49, unit: 'kg', category: 'Vegetables', image: carrotImg },
//   { name: 'Tomato 1kg', rating: 4.5, reviews: 210, price: 2.79, unit: 'kg', category: 'Vegetables', image: tomatoImg },
//   { name: 'Orange Juice 1L', rating: 4.6, reviews: 230, price: 3.29, unit: 'L', category: 'Beverages', image: organgejuiceImg },
// ];

// function Home({ addToCart, addToFavourites }) {
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Beverages'];

//   const filteredProducts = selectedCategory === 'All'
//     ? products
//     : products.filter(p => p.category === selectedCategory);

//   return (
//     <div>
//       <div className="hero">
//         <div className="hero-content">
//           <h1>Fresh Groceries Delivered in 30 Minutes</h1>
//           <p>Shop farm-fresh fruits, vegetables, dairy and more.</p>
//           {/* Navigates to the ID of your products section */}
//           <a href="#products" className="shop-now-btn">
//             Shop Now <span>&rsaquo;</span>
//           </a>
//         </div>
//       </div>

//       <div className="offers-section">
//         <h2 className="section-title">Weekly Offers</h2>
//         <div className="offers-grid">
//           <div className="offer-card">
//             <div className="offer-icon">🥬</div>
//             <h3>Fresh Vegetables</h3>
//             <p className="offer-discount">Up to 30% off</p>
//           </div>
//           <div className="offer-card">
//             <div className="offer-icon">🍎</div>
//             <h3>Seasonal Fruits</h3>
//             <p className="offer-discount">Up to 35% off</p>
//           </div>
//           <div className="offer-card">
//             <div className="offer-icon">🥛</div>
//             <h3>Fresh Dairy</h3>
//             <p className="offer-discount">Milk & Eggs</p>
//           </div>
//         </div>
//       </div>

//       <div className="categories-section">
//         <h2 className="section-title">Categories</h2>
//         <div className="categories-grid">
//           {categories.map(cat => (
//             <button
//               key={cat}
//               className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
//               onClick={() => setSelectedCategory(cat)}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div id='products' className="products-section">
//         <h2 className="section-title">Popular Products</h2>
//         <div className="products-grid">
//           {filteredProducts.map(product => (
//             <div key={product.name} className="product-card">

//               <div className="product-image">
//                 <img src={product.image} alt={product.name} className="product-img" />
//               </div>

//               {/* <div className="product-image">
//                 <span style={{ fontSize: 60 }}>{product.emoji}</span>
//               </div> */}

//               <div className="product-name">{product.name}</div>
//               <div className="product-rating">
//                 ★ {product.rating} ({product.reviews} reviews)
//               </div>
//               <div className="product-price">${product.price}/{product.unit}</div>
//               <div className="product-actions">
//                 <button className="add-to-cart" onClick={() => addToCart(product)}>
//                   Add to Cart
//                 </button>
//                 <button className="fav-btn" onClick={() => addToFavourites(product)}>
//                   ❤️
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <footer className="footer">
//         <div className="footer-content">
//           <div className="footer-section">
//             <h4>QuickLinks</h4>
//             <p>About Us</p>
//             <p>Careers</p>
//             <p>Blog</p>
//             <p>Press</p>
//           </div>
//           <div className="footer-section">
//             <h4>Support</h4>
//             <p>Help Center</p>
//             <p>FAQs</p>
//             <p>Terms of Service</p>
//             <p>Privacy Policy</p>
//           </div>
//           <div className="footer-section">
//             <h4>Contact</h4>
//             <p>📧 support@quickcart.com</p>
//             <p>📞 +1 (800) 123-4567</p>
//             <p>📍 123 Market St, NY</p>
//             <div className="store-buttons">
//               <span className="store-btn">📱 App Store</span>
//               <span className="store-btn">▶️ Google Play</span>
//             </div>
//           </div>
//         </div>
//         <div className="footer-bottom">
//           <p>© 2024 QuickCart. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Home;