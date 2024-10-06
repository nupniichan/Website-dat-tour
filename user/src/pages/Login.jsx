import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { useNavigate } from "react-router-dom";
import "../App.css";
import PagesNames from "../Router/PagesNames";
import "../pages/Registration.css";

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Hàm xử lý khi nhập dữ liệu
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Hàm xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Đăng nhập thành công!");
                console.log(data);
                const { ID, userName } = data;
                sessionStorage.setItem('userId', ID); 
                sessionStorage.setItem('userName', userName);  
                onLogin(ID, userName);  
                navigate('/');  
            } else {
                alert(data.message || "Đăng nhập thất bại");
            }
        } catch (error) {
            alert("Lỗi kết nối: " + error.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Mật khẩu:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Đăng nhập</button>
            </form>
            <div style={{ textAlign: "center", marginTop: "15px" }}>
                <button onClick={() => navigate(PagesNames.REGISTRATION)} className="button-spacing">
                    Chưa có tài khoản? Đăng ký
                </button>
            </div>
        </div>
    );
};

// Thêm PropTypes validation cho hàm onLogin
Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;
