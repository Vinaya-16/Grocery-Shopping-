import React, { useState } from 'react';
import axios from 'axios';

function AuthModal({ closeModal, onLogin }) {
  const [isSignUp, setIsSignUp] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const password = formData.get('password');
   const API_URL = import.meta.env.VITE_API_URL;

    try {

      const endpoint = isSignUp
        ? `${API_URL}/api/auth/signup`
        : `${API_URL}/api/auth/login`;

      // const payload = isSignUp ? { fullName, email, password } : { email, password };

      const payload = isSignUp
        ? {
          full_name: fullName,
          email,
          password
        }
        : {
          email,
          password
        };

      const response = await axios.post(endpoint, payload);

      // const response = await axios.post(endpoint, {
      //   name: fullName,
      //   email: email,
      //   password: password
      // });

      if (response.data.success) {
        localStorage.setItem(
          'token',
          response.data.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(response.data.user)
        );

        onLogin(response.data.user);

        closeModal();
      }

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        'Authentication failed'
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-x" onClick={closeModal}>
          &times;
        </button>

        <h2>
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>

        <form className="auth-form" onSubmit={handleSubmit}>

          {isSignUp && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />

          <button
            type="submit"
            className="auth-submit-btn"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          {isSignUp
            ? 'Already have an account?'
            : "Don't have an account?"}{' '}

          <span onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Sign In' : 'Create Account'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;