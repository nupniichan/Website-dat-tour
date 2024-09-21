import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Login from './Login'; // Updated import
import Register from './Register'; // Updated import

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      const storedUserName = localStorage.getItem('userName');
      if (token) {
        setIsLoggedIn(true);
        setUserName(storedUserName || ''); // Store username if available
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = (token, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userName', name);
    setIsLoggedIn(true);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName'); // Clear username on logout
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} userName={userName} onLogout={handleLogout} />
      <div>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} /> {/* Pass handleLogin prop */}
          <Route path="/register" element={<Register />} />
        </Routes>
        <h1>Vite + React</h1>
      </div>
    </Router>
  );
}

export default App;
