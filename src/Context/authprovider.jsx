import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authContext as authContext } from '../Context/authcontext';
import { useEffect } from 'react';

function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Decode token to get expiration
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      // If token is expired
      if (currentTime > expirationTime) {
        console.log("🔐 Token expired! Logging out...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        logOut();
        navigate("/auth");
      }
    }
  }, []);

  const isAuthenticated = Boolean(token)

  const login = ({ user, token }) => {
    setToken(token || null)
    setUser(user || null)

    if (token) {
      localStorage.setItem('token', token)
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    }
  }

  const logOut = () => {
    // Step 1: Remove from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem("user")

    // Step 2: Clear state
    setUser(null)
    setToken(null)

    // Step 3: Redirect to login ← ADD THIS
    navigate('/auth');
  }

  const value = {
    setName,
    name,
    login,
    logOut,
    isAuthenticated,
    user
  }

  return (
    <authContext.Provider value={value}> {children} </authContext.Provider>
  )
}

export default AuthProvider