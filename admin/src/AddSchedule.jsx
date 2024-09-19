import React, { useState } from 'react';
import { Box, TextField, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const AddSchedule = () => {
  const [schedule, setSchedule] = useState({ name: '', startDate: '', endDate: '' });
  const [details, setDetails] = useState([]);
  const [eventDate, setEventDate] = useState('');
  const [eventContent, setEventContent] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [descriptionContent, setDescriptionContent] = useState(''); // Thêm trạng thái này
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    if (name === 'eventDate') setEventDate(value);
    if (name === 'eventContent') setEventContent(value);
    if (name === 'eventTime') setEventTime(value);
    if (name === 'descriptionContent') setDescriptionContent(value); // Thêm dòng này
  };

  const handleAddDetail = () => {
    if (eventDate && eventContent && eventTime) {
      setDetails((prev) => [...prev, { date: eventDate, content: eventContent, description: descriptionContent, time: eventTime }]);
      setEventDate('');
      setEventContent('');
      setEventTime('');
      setDescriptionContent(''); // Reset mô tả sau khi thêm
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = {
      ...schedule,
      details,
    };
    
    fetch('http://localhost:5000/add-schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Schedule added:', data);
        navigate('/'); 
      })
      .catch(err => console.error('Error adding schedule:', err));
  };

  return (
    <Box padding={3}>
      <h3>Thêm lịch trình mới</h3>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Tên lịch trình"
          fullWidth
          name="name"
          value={schedule.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          label="Ngày đi"
          type="date"
          fullWidth
          name="startDate"
          value={schedule.startDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Ngày về"
          type="date"
          fullWidth
          name="endDate"
          value={schedule.endDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
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
          name="descriptionContent" // Đặt tên đúng ở đây
          value={descriptionContent}
          onChange={handleDetailChange}
          margin="normal"
        />
        <IconButton color="primary" onClick={handleAddDetail}>
          <AddIcon />
        </IconButton>

        <ul>
          {details.map((detail, index) => (
            <li key={index}>{`Ngày ${detail.date} ${detail.time ? `- Giờ ${detail.time}` : ''}: ${detail.content} - Mô tả: ${detail.description}`}</li>
          ))}
        </ul>

        <Button type="submit" variant="contained" color="primary">
          Lưu
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => navigate('/')}>
          Hủy
        </Button>
      </form>
    </Box>
  );
};

export default AddSchedule;
