import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "../pages/Profile.css"; // Import the CSS file for styling

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const userId = sessionStorage.getItem("userId");

            if (!userId) {
                setError("User ID not found in session storage.");
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:5000/user/${userId}`
                );
                const userData = await response.json();
                setUser(userData);
                setFormData({
                    FULLNAME: userData.FULLNAME,
                    ADDRESS: userData.ADDRESS,
                    DAYOFBIRTH: userData.DAYOFBIRTH,
                    EMAIL: userData.EMAIL,
                    PHONENUMBER: userData.PHONENUMBER,
                });
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const validateForm = () => {
        let formErrors = {};

        // Kiểm tra tên đầy đủ không được để trống
        if (!formData.FULLNAME) {
            formErrors.FULLNAME = "Tên đầy đủ không được để trống.";
        }

        // Kiểm tra email có định dạng hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.EMAIL || !emailRegex.test(formData.EMAIL)) {
            formErrors.EMAIL = "Email không hợp lệ.";
        }

        // Kiểm tra số điện thoại
        const phoneRegex = /^\d{10,11}$/;
        if (!formData.PHONENUMBER || !phoneRegex.test(formData.PHONENUMBER)) {
            formErrors.PHONENUMBER = "Số điện thoại phải có 10-11 chữ số.";
        }

        // Kiểm tra ngày sinh phải lớn hơn 18 tuổi và không vượt quá ngày hiện tại
        if (formData.DAYOFBIRTH) {
            const today = dayjs();
            const birthDate = dayjs(formData.DAYOFBIRTH);
            const age = today.diff(birthDate, "year");
            if (age < 18) {
                formErrors.DAYOFBIRTH = "Bạn phải từ 18 tuổi trở lên.";
            } else if (birthDate.isAfter(today)) {
                formErrors.DAYOFBIRTH =
                    "Ngày sinh không được lớn hơn ngày hiện tại.";
            }
        }

        setErrors(formErrors);

        return Object.keys(formErrors).length === 0;
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra tính hợp lệ của form
        if (!validateForm()) {
            return;
        }

        const userId = sessionStorage.getItem("userId");
        try {
            const response = await fetch(
                `http://localhost:5000/update/user/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setIsEditing(false);
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleTourHistoryClick = () => {
        navigate("/TourHistory");
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h1>Quản lý thông tin cá nhân</h1>
            <form onSubmit={handleSubmit}>
                <p>
                    <strong>Tên đầy đủ:</strong>
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="FULLNAME"
                                value={formData.FULLNAME}
                                onChange={handleChange}
                                required
                            />
                            {errors.FULLNAME && (
                                <span className="error">{errors.FULLNAME}</span>
                            )}
                        </>
                    ) : (
                        <span className="user-data">{user.FULLNAME}</span>
                    )}
                </p>

                <p>
                    <strong>Email:</strong>
                    {isEditing ? (
                        <>
                            <input
                                type="email"
                                name="EMAIL"
                                value={formData.EMAIL}
                                onChange={handleChange}
                                required
                            />
                            {errors.EMAIL && (
                                <span className="error">{errors.EMAIL}</span>
                            )}
                        </>
                    ) : (
                        <span className="user-data">{user.EMAIL}</span>
                    )}
                </p>

                <p>
                    <strong>Số điện thoại:</strong>
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="PHONENUMBER"
                                value={formData.PHONENUMBER}
                                onChange={handleChange}
                                required
                            />
                            {errors.PHONENUMBER && (
                                <span className="error">
                                    {errors.PHONENUMBER}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="user-data">{user.PHONENUMBER}</span>
                    )}
                </p>

                <p>
                    <strong>Địa chỉ:</strong>
                    {isEditing ? (
                        <>
                            <input
                                type="text"
                                name="ADDRESS"
                                value={formData.ADDRESS}
                                onChange={handleChange}
                                required
                            />
                            {errors.ADDRESS && (
                                <span className="error">{errors.ADDRESS}</span>
                            )}
                        </>
                    ) : (
                        <span className="user-data">{user.ADDRESS}</span>
                    )}
                </p>

                <p>
                    <strong>Ngày sinh:</strong>
                    {isEditing ? (
                        <>
                            <input
                                type="date"
                                name="DAYOFBIRTH"
                                value={formData.DAYOFBIRTH.split("T")[0]}
                                onChange={handleChange}
                                required
                            />
                            {errors.DAYOFBIRTH && (
                                <span className="error">
                                    {errors.DAYOFBIRTH}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="user-data">
                            {dayjs(user.DAYOFBIRTH).format("DD/MM/YYYY")}
                        </span>
                    )}
                </p>

                {!isEditing ? (
                    <button type="button" onClick={handleEditClick}>
                        Edit
                    </button>
                ) : (
                    <div className="edit-buttons">
                        <button type="submit">Save</button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>

            <div className="tour-history-button-container">
                <button
                    type="button"
                    className="tour-history-button"
                    onClick={handleTourHistoryClick}
                >
                    Xem lịch sử đặt tour
                </button>
            </div>
        </div>
    );
};

export default Profile;
