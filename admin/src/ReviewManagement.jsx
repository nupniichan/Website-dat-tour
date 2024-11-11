import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    fetch('http://localhost:5000/reviews')
      .then(response => response.json())
      .then(data => {
        setReviews(data);
        setFilteredReviews(data);
      })
      .catch(err => console.error('Error fetching reviews:', err));
  };

  // Filter reviews based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredReviews(
        reviews.filter((review) =>
          review.ID.toString().includes(searchTerm) ||
          review.NOIDUNG.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.SOSAO.toString().includes(searchTerm) ||
          review.IDNGUOIDUNG.toString().includes(searchTerm) ||
          review.IDTOUR.toString().includes(searchTerm)
        )
      );
    } else {
      setFilteredReviews(reviews);
    }
  }, [searchTerm, reviews]);

  const handleAddReviewClick = () => {
    navigate('/add-review');
  };

  const handleEditClick = (id) => {
    navigate(`/edit-review/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá đánh giá này không?')) {
      fetch(`http://localhost:5000/delete-review/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error deleting review');
          }
        })
        .then(() => {
          fetchReviews();
        })
        .catch((err) => console.error('Error deleting review:', err));
    }
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
  };

  const handleCloseDialog = () => {
    setSelectedReview(null);
  };

  const generateStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <Box padding={3}>
      <h3>Quản lý đánh giá</h3>

      <Button
        variant="contained"
        style={{ backgroundColor: '#FFA500', color: 'white', marginBottom: '15px' }}
        onClick={handleAddReviewClick}
      >
        Thêm đánh giá
      </Button>

      <TextField
        label="Tìm kiếm đánh giá"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nội dung</TableCell>
            <TableCell>Số sao</TableCell>
            <TableCell>ID Người dùng</TableCell>
            <TableCell>ID Tour</TableCell>
            <TableCell>Chức năng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredReviews.map((review) => (
            <TableRow key={review.ID}>
              <TableCell>{review.ID}</TableCell>
              <TableCell>{review.NOIDUNG}</TableCell>
              <TableCell>{generateStars(review.SOSAO)}</TableCell>
              <TableCell>{review.IDNGUOIDUNG}</TableCell>
              <TableCell>{review.IDTOUR}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => handleViewDetails(review)}>
                  Xem Chi tiết
                </Button>
                <Button variant="outlined" onClick={() => handleEditClick(review.ID)} style={{ marginLeft: '10px' }}>
                  Sửa
                </Button>
                <Button variant="outlined" onClick={() => handleDelete(review.ID)} style={{ marginLeft: '10px' }}>
                  Xoá
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedReview && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Chi tiết đánh giá</DialogTitle>
          <DialogContent>
            <Box padding={2}>
              <Typography variant="h6" gutterBottom>
                Thông tin đánh giá
              </Typography>
              <Box display="flex" flexDirection="column" gap={1} marginBottom={2}>
                <Typography>ID: <strong>{selectedReview.ID}</strong></Typography>
                <Typography>ID Tour: <strong>{selectedReview.IDTOUR}</strong></Typography>
                <Typography>ID Người dùng: <strong>{selectedReview.IDNGUOIDUNG}</strong></Typography>
                <Typography>Số sao: <strong>{generateStars(selectedReview.SOSAO)}</strong></Typography>
                <Typography>Nội dung: <strong>{selectedReview.NOIDUNG}</strong></Typography>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default ReviewManagement;

