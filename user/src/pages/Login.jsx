import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { useNavigate } from "react-router-dom";
import "../App.css";
import PagesNames from "../Router/PagesNames";
import "../pages/Registration.css"

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            const { token, userName } = data;
            onLogin(token, userName);
            navigate('/');
        } else {
            alert("Đăng nhập thất bại");
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

// Add PropTypes validation for login callback
Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;
