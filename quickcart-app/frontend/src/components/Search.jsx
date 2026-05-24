import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Search({ addToCart, addToFavourites, favourites }) {

  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
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

    } catch (error) {
      console.error('Search fetch error:', error);
    }
  };

  // FILTER PRODUCTS
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(
      searchTerm.toLowerCase()
    )
  );

  return (
    <div className="search-page">

      {/* HEADER */}
      <div className="search-header">
        <h1>
          🔍 Search Groceries
        </h1>
      </div>

      {/* SEARCH INPUT */}
      <div className="search-input-wrapper">

        <span className="search-input-icon">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="modern-search-input"
        />

        {searchTerm && (
          <button
            className="clear-search-btn"
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}

      </div>

      {/* EMPTY */}
      {!searchTerm && (
        <div className="search-empty-box">
          Start typing to search our catalog.
        </div>
      )}

      {/* RESULTS */}
      {searchTerm && (
        <div className="products-grid">

          {filteredProducts.length > 0 ? (

            filteredProducts.map(product => {

              const isFavourite = favourites?.some(
                fav => fav.id === product.id
              );

              return (
                <div
                  key={product.id}
                  className="product-card-modern"
                >

                  {/* WISHLIST */}
                  <button
                    className={`wishlist-icon ${isFavourite ? 'liked' : ''}`}
                    onClick={() =>
                      addToFavourites(product)
                    }
                  >
                    {isFavourite ? '❤️' : '♡'}
                  </button>

                  {/* IMAGE */}
                  <div className="product-image-wrap">
                    <img
                      src={
                        product.image_url?.startsWith('http')
                          ? product.image_url.replace(
                            'http://localhost:5000',
                            API_URL
                          )
                          : `${API_URL}${product.image_url}`
                      }
                      alt={product.name}
                      className="product-img-main"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="product-details">

                    <h3 className="p-name">
                      {product.name}
                    </h3>

                    <div className="p-rating">
                      ⭐ {product.rating}
                      <span>
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="p-price-row">
                      <span className="p-price">
                        ${product.price}
                        <span>
                          /{product.unit}
                        </span>
                      </span>
                    </div>

                    <button
                      className="add-to-cart-dark"
                      onClick={() =>
                        addToCart(product)
                      }
                    >
                      Add to Cart
                    </button>

                  </div>

                </div>
              );
            })

          ) : (

            <div className="search-empty-box">
              No products found.
            </div>

          )}

        </div>
      )}

    </div>
  );
}

export default Search;