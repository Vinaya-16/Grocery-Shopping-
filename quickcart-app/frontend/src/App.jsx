import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';  // Add .jsx
import Home from './components/Home.jsx';      // Add .jsx
import Favourites from './components/Favourites.jsx';  // Add .jsx
import Profile from './components/Profile.jsx';        // Add .jsx
import Search from './components/Search.jsx';          // Add .jsx
import Cart from './components/Cart.jsx';              // Add .jsx
import AuthModal from './components/AuthModal.jsx'; // Add this line
import Checkout from './components/Checkout.jsx';
import Orders from './components/Orders.jsx';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [cart, setCart] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {

    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const token = localStorage.getItem('token');

    if (!token) {
      setCart([]);
      setFavourites([]);
      return;
    }

    fetchCart();
    // fetchWishlist();
  }, []);

  const updateQuantity = async (cartItemId, change) => {

    try {

      const token = localStorage.getItem('token');

      const item = cart.find(
        i => i.id === cartItemId
      );

      if (!item) return;

      const newQuantity = item.quantity + change;

      // STOCK CHECK
      if (newQuantity > item.stock) {
        alert('Stock limit reached');
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL;

      // REMOVE IF 0
      if (newQuantity <= 0) {

        await axios.delete(
          `${API_URL}/api/cart/remove/${cartItemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setCart(prev =>
          prev.filter(i => i.id !== cartItemId)
        );

        return;
      }

      // UPDATE
      await axios.put(
        `${API_URL}/api/cart/update/${cartItemId}`,
        {
          quantity: newQuantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCart(prev =>
        prev.map(i =>
          i.id === cartItemId
            ? { ...i, quantity: newQuantity }
            : i
        )
      );

    } catch (error) {
      console.error('Update quantity error:', error);
    }
  };

  const handleLogin = (userData) => {

    setUser(userData);

    fetchCart();
    fetchWishlist();

    setIsAuthModalOpen(false);
  };


  const addToCart = async (product) => {
    try {

      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please login first');
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL;

      // CHECK EXISTING ITEM
      const existingItem = cart.find(
        item => item.productId === product.id
      );

      // STOCK LIMIT
      if (
        existingItem &&
        existingItem.quantity >= product.stock
      ) {
        alert('Stock limit reached');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/cart/add`,
        {
          product_id: product.id,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        fetchCart();
      }

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        'Failed to add to cart'
      );
    }
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) return;

      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.get(
        `${API_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {

        const formattedCart = response.data.cart.map(item => ({

          // CART ITEM ID
          id: item.id,

          // PRODUCT ID
          productId: item.product.id,

          quantity: item.quantity,

          name: item.product.name,
          price: item.product.price,
          category: item.product.category,
          rating: item.product.rating,
          unit: item.product.unit,
          stock: item.product.stock,
          image: `${API_URL}${item.product.image_url}`
          // image: `http://localhost:5000${item.product.image_url}`
        }));

        setCart(formattedCart);
      }

    } catch (error) {
      console.error('Fetch cart error:', error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const token = localStorage.getItem('token');

      const API_URL = import.meta.env.VITE_API_URL;

      await axios.delete(
        `${API_URL}/api/cart/remove/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCart(prev =>
        prev.filter(item => item.id !== id)
      );

    } catch (error) {
      console.error('Remove cart error:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) return;

      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.get(
        `${API_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {

        const API_URL = import.meta.env.VITE_API_URL;

        const formattedWishlist =
          response.data.wishlist.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            category: item.product.category,

            image: item.product.image_url
              ? `${API_URL}${item.product.image_url}`
              : '',

            rating: item.product.rating
          }));

        setFavourites(formattedWishlist);
      }

    } catch (error) {
      console.error('Fetch wishlist error:', error);
    }
  };

  const addToFavourites = async (product) => {

    try {

      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please login first');
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL;

      // CHECK IF ALREADY EXISTS
      const exists = favourites.some(
        item => item.id === product.id
      );

      // ================= REMOVE =================
      if (exists) {

        await axios.delete(
          `${API_URL}/api/wishlist/remove/${product.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // REMOVE FROM STATE
        setFavourites(prev =>
          prev.filter(item => item.id !== product.id)
        );

      }

      // ================= ADD =================
      else {

        await axios.post(
          `${API_URL}/api/wishlist/add`,
          {
            product_id: product.id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // ADD IMAGE PROPERLY
        setFavourites(prev => [

          ...prev,

          {
            ...product,

            image:
              product.image ||
              `${API_URL}${product.image_url}`
          }
        ]);
      }

    } catch (error) {

      console.error('Wishlist error:', error);

      alert(
        error.response?.data?.message ||
        'Failed to update wishlist'
      );
    }
  };

  const removeFromFavourites = (productName) => {
    setFavourites(favourites.filter(item => item.name !== productName));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');

    setUser(null);
    setCart([]);
    setFavourites([]);

    setIsCartOpen(false);

    setActivePage('home');
  };

  return (
    <div className="app">
      {/* Navbar gets the setter to handle navigation */}
      <Navbar setActivePage={setActivePage} activePage={activePage} openCart={() => {

        if (!user) {
          alert('Please login first');
          return;
        }

        setIsCartOpen(true);
      }} cartCount={
        user
          ? cart.reduce(
            (total, item) => total + item.quantity,
            0
          )
          : 0
      } />
      <div className="page-container">
        {/* Home needs addToFavourites to handle the heart click AND the favourites list to show the red heart */}
        {activePage === 'home' && (
          <Home
            addToCart={addToCart}
            addToFavourites={addToFavourites}
            favourites={favourites}
          />
        )}

        {/* Favourites needs setActivePage so the 'Browse' button works */}
        {activePage === 'favourites' && (
          <Favourites
            favourites={favourites}
            removeFromFavourites={removeFromFavourites}
            addToCart={addToCart}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'profile' && (
          <Profile
            isLoggedIn={!!user}
            user={user}
            openAuth={() => setIsAuthModalOpen(true)}
            handleLogout={handleLogout}
            setActivePage={setActivePage}
            setIsCartOpen={setIsCartOpen}
          />
        )}

        {activePage === 'search' && (
          <Search
            addToCart={addToCart}
            addToFavourites={addToFavourites}
            favourites={favourites}
          />
        )}
        {activePage === 'cart' && <Cart cart={cart} removeFromCart={removeFromCart} />}
        {activePage === 'checkout' && (
          <Checkout
            cart={cart}
            setCart={setCart}
            setActivePage={setActivePage}
          />
        )}
        {activePage === 'orders' && (
          <Orders />
        )}
      </div>

      {isAuthModalOpen && (
        <AuthModal
          closeModal={() => setIsAuthModalOpen(false)}
          onLogin={(userData) => {
            // setUser(userData);
            // setIsAuthModalOpen(false);
            handleLogin(userData);
          }}
        />
      )}

      {isCartOpen && (
        <Cart
          cart={cart}
          closeCart={() => setIsCartOpen(false)}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          setActivePage={setActivePage}
        />
      )}

    </div>
  );
}

export default App;