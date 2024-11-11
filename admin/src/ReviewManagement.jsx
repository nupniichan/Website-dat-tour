import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReviewManagement = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTour, setSelectedTour] = useState(null);
  const [tourReviews, setTourReviews] = useState([]);
  const [reviewSearchTerm, setReviewSearchTerm] = useState('');
  const [starFilter, setStarFilter] = useState('all');
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTourReviews();
  }, []);

  const fetchTourReviews = () => {
    fetch('http://localhost:5000/tour-reviews')
      .then(response => response.json())
      .then(data => {
        setTours(data);
        setFilteredTours(data);
      })
      .catch(err => console.error('Error fetching tour reviews:', err));
  };

  const fetchTourDetailReviews = (tourId) => {
    console.log('Fetching reviews for tour:', tourId);
    
    fetch(`http://localhost:5000/api/reviews/${tourId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data:', data);
        setTourReviews(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Error fetching review details:', err);
        setTourReviews([]);
      });
  };

  useEffect(() => {
    if (searchTerm) {
      setFilteredTours(
        tours.filter((tour) =>
          tour.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.tourId.toString().includes(searchTerm)
        )
      );
    } else {
      setFilteredTours(tours);
    }
  }, [searchTerm, tours]);

  const handleViewDetails = (tour) => {
    setSelectedTour(tour);
    fetchTourDetailReviews(tour.tourId);
  };

  const handleCloseDialog = () => {
    setSelectedTour(null);
    setTourReviews([]);
    setReviewSearchTerm('');
    setStarFilter('all');
    setPage(0);
  };

  const generateStars = (rating) => {
    return '⭐'.repeat(Math.round(rating));
  };

  const getFilteredReviews = () => {
    let filtered = [...tourReviews];
    
    if (starFilter !== 'all') {
      filtered = filtered.filter(review => review.SOSAO === Number(starFilter));
    }
    
    if (reviewSearchTerm) {
      filtered = filtered.filter(review => 
        review.NOIDUNG?.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
        review.FULLNAME?.toLowerCase().includes(reviewSearchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredReviews = getFilteredReviews();
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  
  const getCurrentPageReviews = () => {
    const startIndex = page * itemsPerPage;
    return filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <Box padding={3}>
      <h3>Quản lý đánh giá tour</h3>

      <TextField
        label="Tìm kiếm tour"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Tour</TableCell>
            <TableCell>Tên Tour</TableCell>
            <TableCell>Số đánh giá</TableCell>
            <TableCell>Đánh giá trung bình</TableCell>
            <TableCell>Chức năng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTours.map((tour) => (
            <TableRow key={tour.tourId}>
              <TableCell>{tour.tourId}</TableCell>
              <TableCell>{tour.tourName}</TableCell>
              <TableCell>{tour.totalReviews}</TableCell>
              <TableCell>
                {tour.averageRating ? (
                  <>
                    {generateStars(Number(tour.averageRating))} 
                    ({Number(tour.averageRating).toFixed(1)})
                  </>
                ) : 'Chưa có đánh giá'}
              </TableCell>
              <TableCell>
                <Button 
                  variant="outlined" 
                  onClick={() => handleViewDetails(tour)}
                  disabled={tour.totalReviews === 0}
                >
                  Xem Chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedTour && (
        <Dialog 
          open={true} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Chi tiết đánh giá - {selectedTour.tourName}
          </DialogTitle>
          <DialogContent>
            <Box padding={2}>
              <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="Tìm kiếm đánh giá"
                  variant="outlined"
                  size="small"
                  value={reviewSearchTerm}
                  onChange={(e) => {
                    setReviewSearchTerm(e.target.value);
                    setPage(0);
                  }}
                  sx={{ flexGrow: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Số sao</InputLabel>
                  <Select
                    value={starFilter}
                    onChange={(e) => {
                      setStarFilter(e.target.value);
                      setPage(0);
                    }}
                    label="Số sao"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <MenuItem key={star} value={star}>
                        {star} sao ({tourReviews.filter(r => r.SOSAO === star).length})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                {getCurrentPageReviews().map((review) => (
                  <Box 
                    key={review.ID} 
                    sx={{ 
                      borderBottom: '1px solid #eee',
                      py: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1">
                        <strong>{review.FULLNAME || 'Người dùng'}</strong>
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {new Date(review.thoigian).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: 'orange' }}>
                      {generateStars(review.SOSAO)} ({review.SOSAO} sao)
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {review.NOIDUNG || 'Không có nội dung'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                      Mã vé: {review.IDVE}
                    </Typography>
                  </Box>
                ))}

                {filteredReviews.length === 0 && (
                  <Typography align="center" sx={{ py: 3 }}>
                    Không tìm thấy đánh giá nào
                  </Typography>
                )}
              </Box>

              {filteredReviews.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination 
                    count={totalPages}
                    page={page + 1}
                    onChange={(e, newPage) => setPage(newPage - 1)}
                    color="primary"
                  />
                </Box>
              )}

              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Tổng quan đánh giá
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Typography variant="body2">
                    Tổng số đánh giá: {tourReviews.length}
                  </Typography>
                  <Typography variant="body2">
                    Điểm trung bình: {(tourReviews.reduce((acc, review) => acc + review.SOSAO, 0) / tourReviews.length).toFixed(1)} / 5
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Đóng</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ReviewManagement;


