import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';  // Add .jsx
import Home from './components/Home.jsx';      // Add .jsx
import Favourites from './components/Favourites.jsx';  // Add .jsx
import Profile from './components/Profile.jsx';        // Add .jsx
import Search from './components/Search.jsx';          // Add .jsx
import Cart from './components/Cart.jsx';              // Add .jsx
import AuthModal from './components/AuthModal.jsx'; // Add this line

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [cart, setCart] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = (id, change) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === id) {
        const newQty = (item.quantity || 1) + change;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  const handleLogin = (userData) => {
    setUser(userData);
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
        alert('Added to cart');

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
          id: item._id,
          quantity: item.quantity,
          ...item.product
        }));

        setCart(formattedCart);
      }

    } catch (error) {
      console.error('Fetch cart error:', error);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const addToFavourites = (product) => {
    const isAlreadyFavourite = favourites.find(item => item.name === product.name);

    if (!favourites.find(item => item.name === product.name)) {
      setFavourites([...favourites, product]);
    }

    if (isAlreadyFavourite) {
      // If it's already there, remove it (unlike)
      setFavourites(favourites.filter(item => item.name !== product.name));
    } else {
      // If it's not there, add it (like)
      setFavourites([...favourites, product]);
    }

  };

  const removeFromFavourites = (productName) => {
    setFavourites(favourites.filter(item => item.name !== productName));
  };

  return (
    <div className="app">
      {/* Navbar gets the setter to handle navigation */}
      <Navbar setActivePage={setActivePage} activePage={activePage} openCart={() => setIsCartOpen(true)} cartCount={cart.length} />
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
          />
        )}

        {activePage === 'search' && <Search />}
        {activePage === 'cart' && <Cart cart={cart} removeFromCart={removeFromCart} />}
      </div>

      {isAuthModalOpen && (
        <AuthModal
          closeModal={() => setIsAuthModalOpen(false)}
          onLogin={(userData) => {
            setUser(userData);
            setIsAuthModalOpen(false);
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