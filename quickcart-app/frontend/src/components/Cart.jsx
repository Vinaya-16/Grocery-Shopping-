import React from 'react';

function Cart({ cart, closeCart, removeFromCart, updateQuantity, setActivePage }) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const delivery = cart.length > 0 ? 4.99 : 0;
  const total = subtotal + delivery;

  const handleCloseAndNavigate = () => {
    setActivePage('home'); // Sets the view back to Home
    closeCart();           // Closes the sidebar overlay
  };

  return (
    <div className="cart-overlay" onClick={closeCart}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-x" onClick={handleCloseAndNavigate}>&times;</button>
        </div>

        <div className="cart-items-list">
          {/* ADDED: Empty State Logic based on image_e96bb5.jpg */}
          {cart.length === 0 ? (
            <div className="empty-cart-msg">Your cart is empty</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-header">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <button className="delete-item-btn" onClick={() => removeFromCart(item.id)}>
                      🗑️
                    </button>
                  </div>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="summary-line"><span>Subtotal</span> <span>${subtotal.toFixed(2)}</span></div>
          <div className="summary-line"><span>Delivery</span> <span>${delivery.toFixed(2)}</span></div>
          <div className="summary-line total"><strong>Total</strong> <strong>${total.toFixed(2)}</strong></div>
          {/* Updated class name for the dark button */}
          <button className="auth-submit-btn" style={{ width: '100%', marginTop: '20px' }}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;