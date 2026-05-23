import React from 'react';

function Favourites({
  favourites,
  removeFromFavourites,
  addToCart,
  setActivePage
}) {

  const API_URL = import.meta.env.VITE_API_URL;

  // EMPTY WISHLIST
  if (favourites.length === 0) {
    return (
      <div className="home-container">

        <h2 className="section-title">
          <span style={{ marginRight: '10px' }}>♡</span>
          My Favorites
        </h2>

        <div className="empty-wishlist-container">
          <div className="empty-wishlist-content">

            <div className="empty-heart-icon">♡</div>

            <h3 className="empty-title">
              Your wishlist is empty
            </h3>

            <p className="empty-subtitle">
              Save your favorite items here!
            </p>

            <button
              className="browse-btn-dark"
              onClick={() => {
                setActivePage('home');

                setTimeout(() => {
                  const element =
                    document.getElementById('products');

                  if (element) {
                    element.scrollIntoView({
                      behavior: 'smooth'
                    });
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

  // WISHLIST PRODUCTS
  return (
    <div className="home-container">

      <h2 className="section-title">
        <span style={{ marginRight: '10px' }}>♡</span>
        My Favorites
      </h2>

      <div className="products-grid">

        {favourites.map((product) => (

          <div
            key={product.id}
            className="product-card-modern"
          >

            {/* HEART BUTTON */}
            <button
              className="wishlist-icon liked"
              onClick={() =>
                removeFromFavourites(product.id)
              }
            >
              ❤️
            </button>

            {/* PRODUCT IMAGE */}
            <div className="product-image-wrap">
              <img
                src={product.image}
                alt={product.name}
                className="product-img-main"
              />
            </div>

            {/* PRODUCT DETAILS */}
            <div className="product-details">

              <h3 className="p-name">
                {product.name}
              </h3>

              <div className="p-rating">
                ⭐ {product.rating || 4.5}
              </div>

              <div className="p-price-row">
                <span className="p-price">
                  ${product.price}
                </span>
              </div>

              {/* ADD TO CART */}
              <button
                className="add-to-cart-dark"
                onClick={() => addToCart(product)}
              >
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