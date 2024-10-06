import { useState, useEffect } from 'react';
import PagesRouter from './Router/PagesRouter';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [currentUser, setCurrentUser] = useState(null); // State to hold user info

  // Kiểm tra nếu người dùng đã đăng nhập trước đó
  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setCurrentUser({ fullname: storedUserName });
    }
  }, []);

  const handleLogin = (token, userName) => {
    setCurrentUser({ fullname: userName });
    
    localStorage.setItem('token', token); // Lưu token nếu cần
    localStorage.setItem('userName', userName); // Lưu tên người dùng
  };

  const handleLogout = () => {
    setCurrentUser(null); 
    
    localStorage.removeItem('token'); // Xóa token khi đăng xuất
    localStorage.removeItem('userName'); // Xóa tên người dùng
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
