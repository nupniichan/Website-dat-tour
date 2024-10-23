import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import PagesNames from "../Router/PagesNames";
import "../pages/Registration.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: "",
        phoneNumber: "",
        email: "",
        address: "",
        dayOfBirth: "",
        accountName: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        let validationErrors = {};
        const currentYear = new Date().getFullYear();
        const birthYear = new Date(formData.dayOfBirth).getFullYear();
        const age = currentYear - birthYear;

        // Check if the user is at least 16 years old
        if (age < 16) {
            validationErrors.dayOfBirth = "Bạn phải lớn hơn 16 tuổi";
        }

        // Check for other empty fields
        if (!formData.fullname) validationErrors.fullname = "Họ tên không được để trống";
        if (!formData.phoneNumber) validationErrors.phoneNumber = "Số điện thoại không được để trống";
        if (!formData.email) validationErrors.email = "Email không được để trống";
        if (!formData.address) validationErrors.address = "Địa chỉ không được để trống";
        if (!formData.accountName) validationErrors.accountName = "Tên tài khoản không được để trống";
        if (!formData.password) validationErrors.password = "Mật khẩu không được để trống";
        if (!formData.confirmPassword) validationErrors.confirmPassword = "Nhập lại mật khẩu không được để trống";

        // Password and confirm password match
        if (formData.password !== formData.confirmPassword) {
            validationErrors.confirmPassword = "Mật khẩu và nhập lại mật khẩu không khớp";
        }

        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Đăng ký thành công!");
            navigate(PagesNames.LOGIN);
        } else {
            const errorData = await response.json();
            setErrors(errorData);
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
                    placeholder="Full Name"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                />
                {errors.fullname && <p className="error-text">{errors.fullname}</p>}

                <label htmlFor="phoneNumber">Số điện thoại:</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
                {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}

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
                {errors.address && <p className="error-text">{errors.address}</p>}

                <label htmlFor="dayOfBirth">Ngày sinh:</label>
                <input
                    type="date"
                    id="dayOfBirth"
                    name="dayOfBirth"
                    value={formData.dayOfBirth}
                    onChange={handleChange}
                    required
                />
                {errors.dayOfBirth && <p className="error-text">{errors.dayOfBirth}</p>}

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
                {errors.accountName && <p className="error-text">{errors.accountName}</p>}

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
                {errors.email && <p className="error-text">{errors.email}</p>}

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
                {errors.password && <p className="error-text">{errors.password}</p>}

                <label htmlFor="confirmPassword">Nhập lại mật khẩu:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

                <button type="submit">Đăng ký</button>
            </form>
            <div style={{ textAlign: "center", marginTop: "15px" }}>
                <button onClick={() => navigate(PagesNames.LOGIN)} className="button-spacing">
                    Đã có tài khoản? Đăng nhập
                </button>
            </div>
        </div>
    );
};

export default Register;
