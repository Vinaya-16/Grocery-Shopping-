import React from 'react';

function Profile({ isLoggedIn, openAuth, user }) {
  // If not logged in, show the empty state from image_1c36d0.png
  if (!isLoggedIn) {
    return (
      <div className="home-container">
        <div className="empty-profile-container">
          <div className="empty-profile-content">
            <div className="profile-placeholder-icon">👤</div>
            <h3 className="empty-profile-text">Please login to view your profile</h3>
            <button className="sign-in-btn" onClick={openAuth}>Sign In</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="profile-details-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">👤</div>
            <h2>{user?.name}</h2>
          </div>
          <hr />
          <div className="profile-info">
            <p><strong>Email:</strong> {user?.email}</p>
            {/* <p><strong>Member Since:</strong>{}</p> */}
          </div>
          <button className="logout-btn" onClick={() => window.location.reload()}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;