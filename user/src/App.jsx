import { useState, useEffect } from "react";
import PageRouter from "./Router/PagesRouter"; // Cập nhật đường dẫn cho PageRouter
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useNavigate } from "react-router";
function App() {
    const [currentUser, setCurrentUser] = useState(null); // State to hold user info
    const navigate = useNavigate();
    // Kiểm tra nếu người dùng đã đăng nhập trước đó
    useEffect(() => {
        const storedUserName = sessionStorage.getItem("userName");
        if (storedUserName) {
            setCurrentUser({ fullname: storedUserName });
        }
    }, []);

    const handleLogin = (token, userName) => {
        setCurrentUser({ fullname: userName });

        sessionStorage.setItem("token", token);
        sessionStorage.setItem("userName", userName);
    };

    const handleLogout = () => {
        setCurrentUser(null);

        sessionStorage.removeItem("token"); // Xóa token khi đăng xuất
        sessionStorage.removeItem("userName"); // Xóa tên người dùng
        sessionStorage.removeItem("userId"); // Xóa tên người dùng
        navigate(`/`);
    };

    return (
        <>
            <Header user={currentUser} onLogout={handleLogout} />
            <PageRouter onLogin={handleLogin} user={currentUser} />{" "}
            {/* Truyền user nếu cần */}
            <Footer />
        </>
    );
}

export default App;
