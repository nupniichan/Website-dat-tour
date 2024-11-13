import { useState } from "react";
import PropTypes from "prop-types";
import "../pages/Registration.css";
import { message } from "antd";

const Register = ({ onRegisterSuccess, onClose, onOpenLogin }) => {
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
        // Reset error when user starts typing
        setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
    };

    const validate = () => {
        let validationErrors = {};
        const currentDate = new Date();
        const birthDate = new Date(formData.dayOfBirth);

        // Kiểm tra ngày sinh không được nằm trong tương lai
        if (birthDate > currentDate) {
            validationErrors.dayOfBirth = "Ngày sinh không được nằm trong tương lai";
            return validationErrors;
        }

        // Kiểm tra tuổi
        const currentYear = currentDate.getFullYear();
        const birthYear = birthDate.getFullYear();
        const age = currentYear - birthYear;
        const phonePattern = /^[0-9]{10,11}$/;

        // Age validation (must be at least 16)
        if (age < 16) {
            validationErrors.dayOfBirth = "Bạn phải lớn hơn 16 tuổi";
        }

        // Field validations
        if (!formData.fullname) validationErrors.fullname = "Họ tên không được để trống";
        if (!formData.phoneNumber) {
            validationErrors.phoneNumber = "Số điện thoại không được để trống";
        } else if (!phonePattern.test(formData.phoneNumber)) {
            validationErrors.phoneNumber = "Số điện thoại phải chứa 10-11 chữ số";
        }
        if (!formData.email) validationErrors.email = "Email không được để trống";
        if (!formData.address) validationErrors.address = "Địa chỉ không được để trống";
        if (!formData.accountName) validationErrors.accountName = "Tên tài khoản không được để trống";
        if (!formData.password) validationErrors.password = "Mật khẩu không được để trống";
        if (!formData.confirmPassword) validationErrors.confirmPassword = "Nhập lại mật khẩu không được để trống";

        // Password match validation
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
            return; // Stop form submission if validation errors exist
        }

        // Send data if no errors
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            message.success({ content: 'Đăng ký thành công! 🥳🎊' });
            onRegisterSuccess();
            onClose();
        } else {
            const errorData = await response.json();
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: errorData.message, // Display server error message
            }));
            message.error({ content: 'Đăng ký thất bại 🙀' });
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="mt-3" noValidate>
                <label htmlFor="fullname">Họ tên:</label>
                <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    placeholder="Họ tên"
                    value={formData.fullname}
                    onChange={handleChange}
                />
                {errors.fullname && <p className="error-text">{errors.fullname}</p>}

                <label htmlFor="phoneNumber">Số điện thoại:</label>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Số điện thoại"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                />
                {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}

                <label htmlFor="address">Địa chỉ:</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Địa chỉ"
                    value={formData.address}
                    onChange={handleChange}
                />
                {errors.address && <p className="error-text">{errors.address}</p>}

                <label htmlFor="dayOfBirth">Ngày sinh:</label>
                <input
                    type="date"
                    id="dayOfBirth"
                    name="dayOfBirth"
                    value={formData.dayOfBirth}
                    onChange={handleChange}
                />
                {errors.dayOfBirth && <p className="error-text">{errors.dayOfBirth}</p>}

                <label htmlFor="accountName">Tên tài khoản:</label>
                <input
                    type="text"
                    id="accountName"
                    name="accountName"
                    placeholder="Tên tài khoản"
                    value={formData.accountName}
                    onChange={handleChange}
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
                />
                {errors.email && <p className="error-text">{errors.email}</p>}

                <label htmlFor="password">Mật khẩu:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
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
                />
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}

                <button type="submit" className="p-3 mt-4 bg-orange-500 text-white rounded cursor-pointer hover:bg-orange-600">
                    Đăng ký
                </button>
            </form>
            <div style={{ textAlign: "center", marginTop: "15px" }}>
                <button
                    onClick={() => {
                        onClose();
                        setTimeout(onOpenLogin, 200);
                    }}
                    className="button-spacing"
                >
                    Đã có tài khoản? <span className="hover:text-orange-500">Đăng nhập</span>
                </button>
            </div>
        </div>
    );
};

Register.propTypes = {
    onRegisterSuccess: PropTypes.func,
    onClose: PropTypes.func,
    onOpenLogin: PropTypes.func
};

export default Register;
