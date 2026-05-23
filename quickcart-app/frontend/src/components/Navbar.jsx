import React from 'react';

function Navbar({ setActivePage, activePage, openCart, cartCount }) {
  return (
    <nav className="navbar">
      {/* Top Row: Logo, Search, and Cart */}
      <div className="nav-top">
        <div className="logo" onClick={() => setActivePage('home')}>
          🍃 QuickCart
        </div>

        <div
          className="cart-icon-standalone"
          onClick={openCart}
        >

          🛒

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}

        </div>

        <button
          className={activePage === 'orders' ? 'active' : ''}
          onClick={() => setActivePage('orders')}
        >
          📦 Orders
        </button>
      </div>

      {/* Bottom Row: Navigation Links */}
      <div className="nav-bottom">
        <div className="nav-links">
          <button
            className={activePage === 'home' ? 'active' : ''}
            onClick={() => setActivePage('home')}
          >
            🏠 Home
          </button>
          <button
            className={activePage === 'favourites' ? 'active' : ''}
            onClick={() => setActivePage('favourites')}
          >
            ♡ Favorites
          </button>
          <button
            className={activePage === 'profile' ? 'active' : ''}
            onClick={() => setActivePage('profile')}
          >
            👤 Profile
          </button>
          <button
            className={activePage === 'search' ? 'active' : ''}
            onClick={() => setActivePage('search')}
          >
            🔍 Search
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;