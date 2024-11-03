// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            const { token, userName } = data;
            onLogin(token, userName);
            alert(data.message);
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="fullname">Email:</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="fullname">Mật khẩu:</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

// Add PropTypes validation
Login.propTypes = {
    onLogin: PropTypes.func.isRequired, // Validate that onLogin is a required function
};

export default Login;
