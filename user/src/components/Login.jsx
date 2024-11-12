import PropTypes from "prop-types";
import { useState } from "react";
import "../pages/Registration.css";
import { message } from "antd";

const Login = ({ onLogin, onClose, onOpenRegister }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Reset error message

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                message.success({ content: "Đăng nhập thành công 🎉" });
                const { ID, userName } = data;
                sessionStorage.setItem("userId", ID);
                sessionStorage.setItem("userName", userName);
                onLogin(ID, userName); // Call the onLogin function to handle login state
                onClose(); // Close the modal after login
                console.log(ID);
                console.log(userName);
            } else {
                setErrorMessage(data.message || "Đăng nhập thất bại");
            }
        } catch (error) {
            setErrorMessage("Lỗi kết nối: " + error.message);
        }
    };

    return (
        <div className="auth-container">
            {errorMessage && (
                <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}{" "}
            {/* Display error message */}
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
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button
                    type="submit"
                    className="p-3 mt-5 bg-orange-500 text-white rounded cursor-pointer hover:bg-orange-600"
                >
                    Đăng nhập
                </button>
            </form>
            <div style={{ textAlign: "center", marginTop: "15px" }}>
                <button onClick={onOpenRegister} className="button-spacing">
                    Chưa có tài khoản?{" "}
                    <span className="hover:text-orange-500">Đăng ký</span>
                </button>
            </div>
        </div>
    );
};

Login.propTypes = {
    onLogin: PropTypes.func,
    onClose: PropTypes.func,
    onOpenRegister: PropTypes.func, // Prop for opening the registration modal
};

export default Login;
