import React from 'react';

function Favourites({ favourites, removeFromFavourites, addToCart, setActivePage }) {
  if (favourites.length === 0) {
    return (
      <div className="home-container">
        {/* Page Title */}
        <h2 className="section-title">
          <span style={{ marginRight: '10px' }}>♡</span> My Favorites
        </h2>

        {/* Empty State Container */}
        <div className="empty-wishlist-container">
          <div className="empty-wishlist-content">
            <div className="empty-heart-icon">♡</div>
            <h3 className="empty-title">Your wishlist is empty</h3>
            <p className="empty-subtitle">Save your favorite items here!</p>
            {/* <button className="browse-btn-dark" onClick={() => setActivePage('#products')}>
              Browse Products
            </button> */}

            <button
              className="browse-btn-dark"
              onClick={() => {
                setActivePage('home');
                // Give React a tiny moment to render the Home page, then scroll
                setTimeout(() => {
                  const element = document.getElementById('products');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}
            >
              Browse Products
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Title with Heart Icon as seen in image_1cc19e.jpg */}
      <h2 className="section-title">
        <span style={{ marginRight: '10px' }}>♡</span> My Favorites
      </h2>

      <div className="products-grid">
        {favourites.map(product => (
          <div key={product.name} className="product-card-modern">
            {/* Red heart indicator in top right */}
            <button
              className="wishlist-icon liked"
              onClick={() => removeFromFavourites(product.name)}
            >
              ❤️
            </button>

            <div className="product-image-wrap">
              {/* Uses product.image (URL) instead of emoji for high quality */}
              <img src={product.image} alt={product.name} className="product-img-main" />
            </div>

            <div className="product-details">
              <h3 className="p-name">{product.name}</h3>
              {/* Rating and Price lines */}
              <div className="p-rating">⭐ {product.rating} <span>({product.reviews})</span></div>
              <div className="p-price-row">
                <span className="p-price">${product.price}<span>/pc</span></span>
              </div>

              {/* Dark Add to Cart button */}
              <button className="add-to-cart-dark" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favourites;