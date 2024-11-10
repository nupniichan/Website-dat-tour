import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../App.css";
import PagesNames from "../Router/PagesNames.js";
import "../pages/Registration.css"

const Register = ({ onRegisterSuccess, onClose, onOpenLogin }) => {
    const navigate = useNavigate();
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
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Đăng ký thành công!");
            onRegisterSuccess(); // Call the success callback to handle registration success
            onClose(); // Close the modal after registration
        } else {
            alert("Đăng ký thất bại");
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="fullname">Họ tên:</label>
                <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    placeholder="Họ tên"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="phoneNumber">Số điện thoại:</label>
                <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Số điện thoại"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="address">Địa chỉ:</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Địa chỉ"
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
                    placeholder="Tên tài khoản"
                    value={formData.accountName}
                    onChange={handleChange}
                    required
                />

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
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Đăng ký</button>
            </form>
            <div style={{ textAlign: "center", marginTop: "15px" }}>
                <button
                    onClick={() => {
                        onClose(); // Close register modal
                        setTimeout(onOpenLogin, 200); // Open login modal after 200ms delay
                    }}
                    className="button-spacing"
                >
                    Đã có tài khoản? Đăng nhập
                </button>
            </div>
        </div>
    );
};

Register.propTypes = {
    onRegisterSuccess: PropTypes.func, // Callback for registration success
    onClose: PropTypes.func, // Function to close the modal
    onOpenLogin: PropTypes.func
};

export default Register;
