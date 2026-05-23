import React from 'react';

function Cart({
  cart,
  closeCart,
  removeFromCart,
  updateQuantity,
  setActivePage
}) {

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (item.price * item.quantity),
    0
  );

  const deliveryFee =
    subtotal > 500
      ? 0
      : subtotal === 0
        ? 0
        : 40;

  const total = subtotal + deliveryFee;

  return (
    <div className="cart-overlay">

      <div className="cart-sidebar">

        {/* HEADER */}
        <div className="cart-header">

          <div>
            <h2>Your Cart</h2>

            <p className="cart-subtitle">
              {cart.length} items added
            </p>
          </div>

          <button
            className="close-cart-btn"
            onClick={closeCart}
          >
            ✕
          </button>

        </div>

        {/* EMPTY */}
        {cart.length === 0 ? (

          <div className="empty-cart-container">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h3>Your cart is empty</h3>

            <p>
              Add fresh groceries to begin shopping.
            </p>

          </div>

        ) : (

          <>
            {/* ITEMS */}
            <div className="cart-items">

              {cart.map(item => (

                <div
                  key={item.id}
                  className="cart-item"
                >

                  {/* IMAGE */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  {/* INFO */}
                  <div className="cart-item-info">

                    <h3>{item.name}</h3>

                    <p className="cart-price">
                      ₹{item.price}
                    </p>

                    <div className="qty-controls">

                      <button
                        onClick={() =>
                          updateQuantity(item.id, -1)
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        disabled={
                          item.quantity >= item.stock
                        }
                        onClick={() =>
                          updateQuantity(item.id, 1)
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* REMOVE */}
                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    ✕
                  </button>

                </div>

              ))}

            </div>

            {/* FOOTER */}
            <div className="cart-footer">

              <div className="cart-summary-box">

                <div className="cart-row">
                  <span>Subtotal</span>

                  <span>
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="cart-row">
                  <span>Delivery Fee</span>

                  <span>
                    {deliveryFee === 0
                      ? 'FREE'
                      : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="cart-row total-row">
                  <span>Total</span>

                  <span>
                    ₹{total.toFixed(2)}
                  </span>
                </div>

              </div>

              {subtotal < 500 && subtotal > 0 && (
                <p className="free-delivery-note">
                  Add ₹{(500 - subtotal).toFixed(2)}
                  more for FREE delivery
                </p>
              )}

              <button
                className="checkout-btn"
                onClick={() => {
                  closeCart();
                  setActivePage('checkout');
                }}
              >
                Proceed to Checkout
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Cart;