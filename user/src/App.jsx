import { useState } from 'react';
import PagesRouter from './Router/PagesRouter';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [currentUser, setCurrentUser] = useState(null); // State to hold user info

  const handleLogin = (token, userName) => {
    // Set user data
    setCurrentUser({ fullname: userName });
    // Save the token or handle it as necessary
  };

  const handleLogout = () => {
    setCurrentUser(null); // Clear user info on logout
    // Optionally, clear the token or redirect
  };

  return (
    <>
      <Header user={currentUser} onLogout={handleLogout} />
        <PagesRouter onLogin={handleLogin} />
      <Footer />
    </>
  );
}

export default App;
