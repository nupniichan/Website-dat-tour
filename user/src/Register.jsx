import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dayOfBirth, setDayOfBirth] = useState('');
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Validate fullname
    if (!fullname.trim()) {
      newErrors.fullname = 'Họ tên không được để trống';
    } else if (fullname.length < 2) {
      newErrors.fullname = 'Họ tên phải có ít nhất 2 ký tự';
    }

    // Validate phoneNumber
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ (phải có 10 chữ số)';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Validate address
    if (!address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống';
    }

    // Validate dayOfBirth
    const today = new Date();
    const birthDate = new Date(dayOfBirth);
    if (!dayOfBirth) {
      newErrors.dayOfBirth = 'Ngày sinh không được để trống';
    } else if (birthDate > today) {
      newErrors.dayOfBirth = 'Ngày sinh không thể là ngày trong tương lai';
    }

    // Validate accountName
    if (!accountName.trim()) {
      newErrors.accountName = 'Tên tài khoản không được để trống';
    } else if (accountName.length < 4) {
      newErrors.accountName = 'Tên tài khoản phải có ít nhất 4 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setSubmitError('');
    
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname,
          phoneNumber,
          email,
          address,
          dayOfBirth,
          accountName,
          password,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        navigate('/login');
      } else {
        setSubmitError(data.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  return (
    <div style={styles.authContainer}>
      <h2 style={styles.title}>Đăng ký</h2>
      {submitError && <div style={styles.submitError}>{submitError}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label htmlFor="fullname" style={styles.label}>Họ tên:</label>
        <input
          type="text"
          id="fullname"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
          style={styles.input}
        />
        {errors.fullname && <span style={styles.error}>{errors.fullname}</span>}

        <label htmlFor="phoneNumber" style={styles.label}>Số điện thoại:</label>
        <input
          type="text"
          id="phoneNumber"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          style={styles.input}
        />
        {errors.phoneNumber && <span style={styles.error}>{errors.phoneNumber}</span>}

        <label htmlFor="email" style={styles.label}>Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        {errors.email && <span style={styles.error}>{errors.email}</span>}

        <label htmlFor="address" style={styles.label}>Địa chỉ:</label>
        <input
          type="text"
          id="address"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          style={styles.input}
        />
        {errors.address && <span style={styles.error}>{errors.address}</span>}

        <label htmlFor="dayOfBirth" style={styles.label}>Ngày sinh:</label>
        <input
          type="date"
          id="dayOfBirth"
          placeholder="Date of Birth"
          value={dayOfBirth}
          onChange={(e) => setDayOfBirth(e.target.value)}
          required
          style={styles.input}
        />
        {errors.dayOfBirth && <span style={styles.error}>{errors.dayOfBirth}</span>}

        <label htmlFor="accountName" style={styles.label}>Tên tài khoản:</label>
        <input
          type="text"
          id="accountName"
          placeholder="Account Name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
          style={styles.input}
        />
        {errors.accountName && <span style={styles.error}>{errors.accountName}</span>}

        <label htmlFor="password" style={styles.label}>Mật khẩu:</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {errors.password && <span style={styles.error}>{errors.password}</span>}

        <button type="submit" style={styles.button}>Đăng ký</button>
      </form>
    </div>
  );
};

const styles = {
  authContainer: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '5px',
    color: '#666',
  },
  input: {
    padding: '8px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '0.8em',
    marginTop: '5px',
    marginBottom: '10px',
  },
  submitError: {
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '4px',
    fontSize: '1em',
    color: '#f44336',
  },
};

export default Register;
