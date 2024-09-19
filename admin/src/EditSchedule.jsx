import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';

const EditSchedule = () => {
  const { id } = useParams();
  const [schedule, setSchedule] = useState({
    name: '',
    startDate: '',
    endDate: '',
    details: [],
  });
  const [eventDate, setEventDate] = useState('');
  const [eventContent, setEventContent] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [descriptionContent, setDescriptionContent] = useState('');
  const [editingDetailIndex, setEditingDetailIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch schedule data from the server
    fetch(`http://localhost:5000/schedules/${id}`)
      .then(response => response.json())
      .then(data => {
        // Set schedule state with details from the fetched data
        setSchedule({
          name: data[0].ID_LICH_TRINH || '',
          startDate: data[0].NGAY || '',
          endDate: data[0].NGAY || '',
          details: data || [], // Assuming data is an array of details
        });
      })
      .catch(err => console.error('Error fetching schedule:', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    if (name === 'eventDate') setEventDate(value);
    if (name === 'eventContent') setEventContent(value);
    if (name === 'eventTime') setEventTime(value);
    if (name === 'descriptionContent') setDescriptionContent(value);
  };

  const handleAddDetail = () => {
    if (eventDate && eventContent && eventTime) {
      if (editingDetailIndex !== null) {
        // Update existing detail
        const updatedDetails = schedule.details.map((detail, index) =>
          index === editingDetailIndex
            ? { NGAY: eventDate, SUKIEN: eventContent, MOTA: descriptionContent, GIO: eventTime }
            : detail
        );
        setSchedule(prev => ({ ...prev, details: updatedDetails }));
        setEditingDetailIndex(null);
      } else {
        // Add new detail
        setSchedule(prev => ({
          ...prev,
          details: [
            ...prev.details,
            { NGAY: eventDate, SUKIEN: eventContent, MOTA: descriptionContent, GIO: eventTime }
          ],
        }));
      }
      // Reset form
      setEventDate('');
      setEventContent('');
      setEventTime('');
      setDescriptionContent('');
    }
  };

  const handleEditDetail = (index) => {
    const detail = schedule.details[index];
    setEventDate(detail.NGAY);
    setEventContent(detail.SUKIEN);
    setEventTime(detail.GIO);
    setDescriptionContent(detail.MOTA);
    setEditingDetailIndex(index);
  };

  const handleDeleteDetail = (index) => {
    setSchedule(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/update-schedule/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Schedule updated:', data);
        navigate('/schedule-management');
      })
      .catch(err => console.error('Error updating schedule:', err));
  };

  const formattedStartDate = schedule.startDate ? schedule.startDate.slice(0, 10) : '';
  const formattedEndDate = schedule.endDate ? schedule.endDate.slice(0, 10) : '';

  return (
    <Box padding={3}>
      <h3>Sửa Lịch Trình</h3>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tên lịch trình"
          name="name"
          fullWidth
          value={schedule.name}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Ngày đi"
          name="startDate"
          type="date"
          fullWidth
          value={formattedStartDate}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        />
        <TextField
          label="Ngày về"
          name="endDate"
          type="date"
          fullWidth
          value={formattedEndDate}
          onChange={handleChange}
          required
          style={{ marginBottom: '10px' }}
        />

        <h4>Chi tiết lịch trình</h4>
        <TextField
          label="Ngày"
          type="date"
          fullWidth
          name="eventDate"
          value={eventDate}
          onChange={handleDetailChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Giờ"
          type="time"
          fullWidth
          name="eventTime"
          value={eventTime}
          onChange={handleDetailChange}
          margin="normal"
        />
        <TextField
          label="Sự kiện"
          fullWidth
          name="eventContent"
          value={eventContent}
          onChange={handleDetailChange}
          margin="normal"
        />
        <TextField
          label="Mô tả"
          fullWidth
          name="descriptionContent"
          value={descriptionContent}
          onChange={handleDetailChange}
          margin="normal"
        />
        <IconButton color="primary" onClick={handleAddDetail}>
          <AddIcon />
        </IconButton>

        <ul>
          {schedule.details.length ? (
            schedule.details.map((detail, index) => (
              <li key={index}>
                {`Ngày ${detail.NGAY.slice(0, 10)} ${detail.GIO ? `- Giờ ${detail.GIO}` : ''}: ${detail.SUKIEN} - Mô tả: ${detail.MOTA}`}
                <IconButton color="primary" onClick={() => handleEditDetail(index)}>
                  Sửa
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteDetail(index)}>
                  Xoá
                </IconButton>
              </li>
            ))
          ) : (
            <li>Chưa có chi tiết nào</li>
          )}
        </ul>

        <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>
          Cập nhật
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/schedule')}>
          Hủy
        </Button>
      </form>
    </Box>
  );
};

export default EditSchedule;
