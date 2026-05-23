import React from 'react';

function Profile({
  isLoggedIn,
  user,
  openAuth,
  handleLogout,
  setActivePage,
  setIsCartOpen
}) {

  if (!isLoggedIn) {
    return (
      <div className="empty-profile-container">

        <div>
          <div className="profile-placeholder-icon">
            👤
          </div>

          <h2 className="empty-profile-text">
            Sign in to view your profile
          </h2>

          <button
            className="sign-in-btn"
            onClick={openAuth}
          >
            Sign In
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="profile-page-mobile">

      {/* PROFILE HEADER */}
      <div className="mobile-profile-header">

        <div className="mobile-avatar">
          {
            (
              user?.full_name?.charAt(0) ||
              user?.email?.charAt(0) ||
              'U'
            ).toUpperCase()
          }
        </div>

        <h2>
          {
            user?.full_name ||
            user?.email?.split('@')[0] ||
            'QuickCart User'
          }
        </h2>

        <p>
          {user?.email}
        </p>

      </div>

      {/* SHOP SECTION */}
      <div className="profile-section">

        <h3>Shopping</h3>

        <div
          className="profile-option-card"
          onClick={() => setActivePage('home')}
        >
          <div className="option-left">
            <span>🏠</span>
            <p>Browse Products</p>
          </div>

          <span>›</span>
        </div>

        <div
          className="profile-option-card"
          onClick={() => setActivePage('favourites')}
        >
          <div className="option-left">
            <span>❤️</span>
            <p>Favorites</p>
          </div>

          <span>›</span>
        </div>

        <div
          className="profile-option-card"
          onClick={() => setIsCartOpen(true)}
        >
          <div className="option-left">
            <span>🛒</span>
            <p>My Cart</p>
          </div>

          <span>›</span>
        </div>

        <div
          className="profile-option-card"
          onClick={() => setActivePage('search')}
        >
          <div className="option-left">
            <span>🔍</span>
            <p>Search Products</p>
          </div>

          <span>›</span>
        </div>

      </div>

      {/* ACCOUNT SECTION */}
      <div className="profile-section">

        <h3>Account</h3>

        <div className="profile-option-card static">
          <div className="option-left">
            <span>📧</span>
            <p>{user?.email}</p>
          </div>
        </div>

      </div>

      {/* LOGOUT */}
      <button
        className="mobile-logout-btn"
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>
  );
}

export default Profile;