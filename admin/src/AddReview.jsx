import React, { useState } from 'react';
import { Box, TextField, Button, FormHelperText, FormControl, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddReview = () => {
  const [review, setReview] = useState({
    NOIDUNG: '',
    SOSAO: '',
    IDNGUOIDUNG: '',
    IDTOUR: '',
  });
  const [errors, setErrors] = useState({
    SOSAO: '',
    IDNGUOIDUNG: '',
    IDTOUR: '',
    NOIDUNG: '',
  });
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};

    if (!review.SOSAO) {
      newErrors.SOSAO = 'Số sao không được để trống.';
    } else if (review.SOSAO < 0 || review.SOSAO > 5) {
      newErrors.SOSAO = 'Số sao phải từ 0 đến 5.';
    }

    if (!review.IDNGUOIDUNG) {
      newErrors.IDNGUOIDUNG = 'ID Người dùng không được để trống.';
    } else if (review.IDNGUOIDUNG < 0) {
      newErrors.IDNGUOIDUNG = 'ID Người dùng không được nhỏ hơn 0.';
    }

    if (!review.IDTOUR) {
      newErrors.IDTOUR = 'ID Tour không được để trống.';
    } else if (review.IDTOUR < 0) {
      newErrors.IDTOUR = 'ID Tour không được nhỏ hơn 0.';
    }

    if (!review.NOIDUNG) {
      newErrors.NOIDUNG = 'Nội dung không được để trống.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    fetch('http://localhost:5000/add-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Review added:', data);
        navigate('/');
      })
      .catch((err) => console.error('Error adding review:', err));
  };

  return (
    <Box padding={3}>
      <h3>Thêm đánh giá mới</h3>

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth style={{ marginBottom: '10px' }} error={Boolean(errors.IDTOUR)}>
          <TextField
            label="ID Tour"
            name="IDTOUR"
            type="number"
            value={review.IDTOUR}
            onChange={handleChange}
            fullWidth
          />
          {errors.IDTOUR && <FormHelperText>{errors.IDTOUR}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth style={{ marginBottom: '10px' }} error={Boolean(errors.IDNGUOIDUNG)}>
          <TextField
            label="ID Người dùng"
            name="IDNGUOIDUNG"
            type="number"
            value={review.IDNGUOIDUNG}
            onChange={handleChange}
            fullWidth
          />
          {errors.IDNGUOIDUNG && <FormHelperText>{errors.IDNGUOIDUNG}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth style={{ marginBottom: '10px' }} error={Boolean(errors.SOSAO)}>
          <TextField
            label="Số sao"
            name="SOSAO"
            type="number"
            value={review.SOSAO}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">⭐</InputAdornment>,
            }}
          />
          {errors.SOSAO && <FormHelperText>{errors.SOSAO}</FormHelperText>}
        </FormControl>

        <FormControl fullWidth style={{ marginBottom: '10px' }} error={Boolean(errors.NOIDUNG)}>
          <TextField
            label="Nội dung"
            name="NOIDUNG"
            value={review.NOIDUNG}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
          {errors.NOIDUNG && <FormHelperText>{errors.NOIDUNG}</FormHelperText>}
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={Boolean(errors.SOSAO || errors.IDNGUOIDUNG || errors.IDTOUR || errors.NOIDUNG)}
        >
          Lưu
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>
          Hủy
        </Button>
      </form>
    </Box>
  );
};

export default AddReview;
