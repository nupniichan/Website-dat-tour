import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, FormHelperText, FormControl, InputAdornment } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const EditReview = () => {
  const { id } = useParams();
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

  useEffect(() => {
    fetch(`http://localhost:5000/reviews/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setReview({
          NOIDUNG: data.NOIDUNG,
          SOSAO: data.SOSAO,
          IDNGUOIDUNG: data.IDNGUOIDUNG,
          IDTOUR: data.IDTOUR,
        });
      })
      .catch((err) => console.error('Error fetching review:', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({ ...prev, [name]: value }));
    if (name === 'SOSAO' || name === 'IDNGUOIDUNG' || name === 'IDTOUR' || name === 'NOIDUNG') {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!review.SOSAO) {
      validationErrors.SOSAO = 'Số sao không được để trống.';
    } else if (review.SOSAO < 0) {
      validationErrors.SOSAO = 'Số sao không được nhỏ hơn 0.';
    }

    if (!review.IDNGUOIDUNG) {
      validationErrors.IDNGUOIDUNG = 'ID Người dùng không được để trống.';
    } else if (review.IDNGUOIDUNG < 0) {
      validationErrors.IDNGUOIDUNG = 'ID Người dùng không được nhỏ hơn 0.';
    }

    if (!review.IDTOUR) {
      validationErrors.IDTOUR = 'ID Tour không được để trống.';
    } else if (review.IDTOUR < 0) {
      validationErrors.IDTOUR = 'ID Tour không được nhỏ hơn 0.';
    }

    if (!review.NOIDUNG) {
      validationErrors.NOIDUNG = 'Nội dung không được để trống.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    fetch(`http://localhost:5000/update-reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    })
      .then((response) => response.json())
      .then(() => {
        navigate('/review');
      })
      .catch((err) => console.error('Error updating review:', err));
  };

  return (
    <Box padding={3}>
      <h3>Sửa Đánh Giá</h3>
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
            fullWidth
            value={review.NOIDUNG}
            onChange={handleChange}
            style={{ marginBottom: '10px' }}
          />
          {errors.NOIDUNG && <FormHelperText>{errors.NOIDUNG}</FormHelperText>}
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={Boolean(errors.SOSAO || errors.IDNGUOIDUNG || errors.IDTOUR || errors.NOIDUNG)}
        >
          Cập nhật
        </Button>
      </form>
    </Box>
  );
};

export default EditReview;
