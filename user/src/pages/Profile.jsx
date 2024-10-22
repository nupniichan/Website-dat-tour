import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../pages/Profile.css"; // Import the CSS file for styling

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = sessionStorage.getItem('userId');

      if (!userId) {
        setError('User ID not found in session storage.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/user/${userId}`);
        const userData = await response.json();
        setUser(userData);
        setFormData({ 
          FULLNAME: userData.FULLNAME, 
          ADDRESS: userData.ADDRESS, 
          DAYOFBIRTH: userData.DAYOFBIRTH, 
          EMAIL: userData.EMAIL, 
          PHONENUMBER: userData.PHONENUMBER 
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:5000/update/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
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
    navigate('/TourHistory');
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <strong>Full Name:</strong>
          {isEditing ? (
            <input 
              type="text" 
              name="FULLNAME" 
              value={formData.FULLNAME} 
              onChange={handleChange} 
              required 
            />
          ) : (
            <span className="user-data">{user.FULLNAME}</span>
          )}
        </p>
        <p>
          <strong>Email:</strong>
          {isEditing ? (
            <input 
              type="email" 
              name="EMAIL" 
              value={formData.EMAIL} 
              onChange={handleChange} 
              required 
            />
          ) : (
            <span className="user-data">{user.EMAIL}</span>
          )}
        </p>
        <p>
          <strong>Phone Number:</strong> 
          {isEditing ? (
            <input 
              type="text" 
              name="PHONENUMBER" 
              value={formData.PHONENUMBER} 
              onChange={handleChange} 
              required 
            />
          ) : (
            <span className="user-data">{user.PHONENUMBER}</span>
          )}
        </p>
        <p>
          <strong>Address:</strong> 
          {isEditing ? (
            <input 
              type="text" 
              name="ADDRESS" 
              value={formData.ADDRESS} 
              onChange={handleChange} 
              required 
            />
          ) : (
            <span className="user-data">{user.ADDRESS}</span>
          )}
        </p>
        <p>
          <strong>Date of Birth:</strong>  
          {isEditing ? (
            <input 
              type="date" 
              name="DAYOFBIRTH" 
              value={formData.DAYOFBIRTH.split('T')[0]} 
              onChange={handleChange} 
              required 
            />
          ) : (
            <span className="user-data">{user.DAYOFBIRTH.split('T')[0]}</span>
          )}
        </p>
        {!isEditing ? (
          <button onClick={handleEditClick}>Edit</button>
        ) : (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        )}
      </form>

      {/* Add the "Xem lịch sử đặt tour" button */}
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
