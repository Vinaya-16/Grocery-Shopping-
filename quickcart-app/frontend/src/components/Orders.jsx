import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {

    try {

      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(
        `${API_URL}/api/orders/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("ORDERS API RESPONSE:", response.data);
      setOrders(response.data.orders || []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

    if (loading) {
      return <div>Loading orders...</div>;
    }
  };

  return (
    <div className="orders-page">

      <h2 className="orders-title">
        My Orders
      </h2>

      {
        orders.length === 0
          ? (
            <div className="empty-orders">
              No orders yet
            </div>
          )
          : (
            <div className="orders-list">

              {orders.map(order => (

                <div
                  key={order._id}
                  className="order-card"
                >

                  <div className="order-top">

                    <div>
                      <h3>
                        Order #{order._id.slice(-6)}
                      </h3>

                      <p>
                        {
                          new Date(
                            order.created_at
                          ).toLocaleString()
                        }
                      </p>
                    </div>

                    <span className="order-status">
                      {order.status}
                    </span>

                  </div>

                  <div className="order-items">

                    {(order.items || []).map(item => (

                      <div
                        key={item.id}
                        className="order-item"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                        />

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

                  </div>

                  <div className="order-bottom">

                    <div>
                      <p>Payment</p>
                      <strong>
                        {order.paymentMethod}
                      </strong>
                    </div>

                    <div>
                      <p>Total</p>
                      <strong>
                        ₹{order.total}
                      </strong>
                    </div>

                  </div>

                </div>
              ))}

            </div>
          )
      }

    </div>
  );
}

export default Orders;