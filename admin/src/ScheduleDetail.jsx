import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Card, CardContent, Stack } from '@mui/material';

const ScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheduleDetails, setScheduleDetails] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/schedules/${id}`)
      .then(response => response.json())
      .then(data => setScheduleDetails(data))
      .catch(err => console.error('Error fetching schedule details:', err));
  }, [id]);

  const handleBack = () => {
    navigate('/schedule');
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <Box padding={3}>
      <Button variant="contained" color="primary" onClick={handleBack} sx={{ marginBottom: 2 }}>
        Quay lại
      </Button>
      <Typography variant="h4" gutterBottom>Chi tiết lịch trình</Typography>
      <Stack spacing={2}>
        {scheduleDetails.map(detail => (
          <Card key={detail.ID} elevation={3}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                {`${formatDate(detail.NGAY)} - ${detail.GIO}: ${detail.SUKIEN}`}
              </Typography>
              <Typography variant="body2">
                <strong>Mô tả:</strong> {detail.MOTA}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default ScheduleDetail;