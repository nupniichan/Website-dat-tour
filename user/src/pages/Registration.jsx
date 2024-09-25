import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../App.css";
import "./Registration.css";


const Registration = ({ onLogin }) => {
    const navigate = useNavigate();
    const [isLoginForm, setIsLoginForm] = useState(true); // Toggle between Login and Register
    const [formData, setFormData] = useState({
        fullname: "",
        phoneNumber: "",
        email: "",
        address: "",
        dayOfBirth: "",
        accountName: "",
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
        const url = isLoginForm
            ? "http://localhost:5000/login"
            : "http://localhost:5000/register";
        const body = isLoginForm
            ? { email: formData.email, password: formData.password }
            : { ...formData };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            if (isLoginForm) {
                const { token, userName } = data;
                onLogin(token, userName);
            } else {
                navigate("/login"); // Redirect to login on successful registration
                setIsLoginForm(true); // Switch to login form after registration
            }
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLoginForm ? "Đăng nhập" : "Đăng ký"}</h2>
            <form onSubmit={handleSubmit}>
                {!isLoginForm && (
                    <>
                        <label htmlFor="fullname">Họ tên:</label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            placeholder="Full Name"
                            value={formData.fullname}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="phoneNumber">Số điện thoại:</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="address">Địa chỉ:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="dayOfBirth">Ngày sinh:</label>
                        <input
                            type="date"
                            id="dayOfBirth"
                            name="dayOfBirth"
                            value={formData.dayOfBirth}
                            onChange={handleChange}
                            required
                        />

                        <label htmlFor="accountName">Tên tài khoản:</label>
                        <input
                            type="text"
                            id="accountName"
                            name="accountName"
                            placeholder="Account Name"
                            value={formData.accountName}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}

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

                <button type="submit">
                    {isLoginForm ? "Đăng nhập" : "Đăng ký"}
                </button>
            </form>
            <button onClick={() => setIsLoginForm(!isLoginForm)}>
                {isLoginForm
                    ? "Chưa có tài khoản? Đăng ký"
                    : "Đã có tài khoản? Đăng nhập"}
            </button>
        </div>
    );
};

// Add PropTypes validation for login callback
Registration.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Registration;
