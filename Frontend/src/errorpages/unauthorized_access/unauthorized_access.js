import React from 'react';
import { useNavigate } from 'react-router-dom';
import './unauthorized_access.css';

const Unauthorized = () => {
  const nav = useNavigate();
  localStorage.removeItem('accesstoken');

  const handleLogout = () => {

    nav('/signup');
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-box">
        <h1>Unauthorized</h1>
        <p>You must log in again to access this page.</p>
        <button onClick={handleLogout} className="logout-button">Go to Signup</button>
      </div>
    </div>
  );
}

export default Unauthorized;
