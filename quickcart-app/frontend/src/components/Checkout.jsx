import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Checkout({
  cart,
  setCart,
  setActivePage
}) {

  const [address, setAddress] = useState('');

  const [paymentMethod, setPaymentMethod] =
    useState('Cash on Delivery');

  const [deliveryType, setDeliveryType] =
    useState('Standard');

  const [loading, setLoading] =
    useState(false);

  const [estimatedTime, setEstimatedTime] =
    useState(30);

  const [orderPlaced, setOrderPlaced] =
    useState(false);

  // SUBTOTAL

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  // DELIVERY FEE

  let deliveryFee = 40;

  if (deliveryType === 'Express') {
    deliveryFee = 80;
  }

  if (deliveryType === 'Scheduled') {
    deliveryFee = 60;
  }

  const total = subtotal + deliveryFee;

  // DELIVERY TIME

  useEffect(() => {

    if (deliveryType === 'Standard') {
      setEstimatedTime(30);
    }

    if (deliveryType === 'Express') {
      setEstimatedTime(15);
    }

    if (deliveryType === 'Scheduled') {
      setEstimatedTime(60);
    }

  }, [deliveryType]);

  // PLACE ORDER

  const placeOrder = async () => {

    if (!address.trim()) {

      alert('Please enter delivery address');

      return;
    }

    try {

      setLoading(true);

      const token =
        localStorage.getItem('token');

      const API_URL =
        import.meta.env.VITE_API_URL;

      const response = await axios.post(
        `${API_URL}/api/orders/create`,
        {
          items: cart,
          total,
          paymentMethod,
          address,
          deliveryType,
          estimatedTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {

        setOrderPlaced(true);

        setTimeout(() => {

          setCart([]);

          setActivePage('orders');

        }, 4000);

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

  // SUCCESS SCREEN

  if (orderPlaced) {

    return (

      <div className="checkout-success">

        <div className="success-card">

          <div className="success-icon">
            🎉
          </div>

          <h2>
            Order Successfully Placed
          </h2>

          <p>
            Your groceries will arrive in
          </p>

          <h1>
            {estimatedTime} mins
          </h1>

          <p>
            Thank you for shopping with QuickCart
          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="checkout-page">

      <div className="checkout-container">

        {/* LEFT SIDE */}

        <div className="checkout-left">

          <h2>Checkout</h2>

          {/* ADDRESS */}

          <div className="checkout-section">

            <label>
              Delivery Address
            </label>

            <textarea
              placeholder="Enter your full address..."
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            />

          </div>

          {/* DELIVERY TYPE */}

          <div className="checkout-section">

            <label>
              Delivery Type
            </label>

            <select
              value={deliveryType}
              onChange={(e) =>
                setDeliveryType(
                  e.target.value
                )
              }
            >

              <option value="Standard">
                Standard Delivery (30 mins)
              </option>

              <option value="Express">
                Express Delivery (15 mins)
              </option>

              <option value="Scheduled">
                Scheduled Delivery (1 hour)
              </option>

            </select>

          </div>

          {/* PAYMENT */}

          <div className="checkout-section">

            <label>
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(
                  e.target.value
                )
              }
            >

              <option value="Cash on Delivery">
                Cash on Delivery
              </option>

              <option value="UPI">
                UPI
              </option>

              <option value="Credit Card">
                Credit / Debit Card
              </option>

            </select>

          </div>

          {/* DELIVERY INFO */}

          <div className="delivery-info-box">

            <h3>
              Estimated Delivery
            </h3>

            <p>
              🚚 Arriving in
              <strong>
                {' '} {estimatedTime} mins
              </strong>
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="checkout-right">

          <h3>
            Order Summary
          </h3>

          {cart.map(item => (

            <div
              key={item.id}
              className="summary-item"
            >

              <div>

                <p>
                  {item.name}
                </p>

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

            <span>
              ₹{subtotal}
            </span>

          </div>

          <div className="summary-total">

            <p>Delivery</p>

            <span>
              ₹{deliveryFee}
            </span>

          </div>

          <div className="summary-total grand-total">

            <p>Total</p>

            <span>
              ₹{total}
            </span>

          </div>

          <button
            className="place-order-btn"
            onClick={placeOrder}
            disabled={loading}
          >

            {
              loading
                ? 'Placing Order...'
                : 'Confirm Order'
            }

          </button>

        </div>

      </div>

    </div>
  );
}

export default Checkout;