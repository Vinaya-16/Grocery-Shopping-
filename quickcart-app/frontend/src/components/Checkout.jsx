import React, { useState } from 'react';
import axios from 'axios';

function Checkout({
  cart,
  setCart,
  setActivePage
}) {

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 40 : 0;

  const total = subtotal + deliveryFee;

  const placeOrder = async () => {

    if (!address.trim()) {
      alert('Please enter delivery address');
      return;
    }

    try {

      setLoading(true);

      const token = localStorage.getItem('token');

      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.post(
        `${API_URL}/api/orders/create`,
        {
          items: cart,
          total,
          paymentMethod,
          address
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {

        alert('Order placed successfully 🎉');

        setCart([]);

        setActivePage('home');
      }

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        'Failed to place order'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        {/* LEFT */}
        <div className="checkout-left">

          <h2>Checkout</h2>

          <div className="checkout-section">

            <label>Delivery Address</label>

            <textarea
              placeholder="Enter your full address..."
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            />

          </div>

          <div className="checkout-section">

            <label>Payment Method</label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            >
              <option>Cash on Delivery</option>
              <option>UPI</option>
              <option>Credit Card</option>
            </select>

          </div>

        </div>

        {/* RIGHT */}
        <div className="checkout-right">

          <h3>Order Summary</h3>

          {cart.map(item => (

            <div
              key={item.id}
              className="summary-item"
            >

              <div>
                <p>{item.name}</p>
                <span>
                  Qty: {item.quantity}
                </span>
              </div>

              <strong>
                ₹{item.price * item.quantity}
              </strong>

            </div>
          ))}

          <div className="summary-total">
            <p>Subtotal</p>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-total">
            <p>Delivery</p>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="summary-total grand-total">
            <p>Total</p>
            <span>₹{total}</span>
          </div>

          <button
            className="place-order-btn"
            onClick={placeOrder}
            disabled={loading}
          >
            {
              loading
                ? 'Placing Order...'
                : 'Place Order'
            }
          </button>

        </div>

      </div>
    </div>
  );
}

export default Checkout;