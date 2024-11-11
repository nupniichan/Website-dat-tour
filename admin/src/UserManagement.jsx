import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Fetch users from the backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:5000/users') // Endpoint cần phải chỉnh sửa để phù hợp với API của bạn
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch(err => console.error('Error fetching users:', err));
  };
  
  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredUsers(
        users.filter((user) =>
          user.ID.toString().includes(searchTerm)||
          user.ADDRESS.toString().includes(searchTerm) ||
          user.ACCOUNTNAME.toLowerCase().includes(searchTerm.toLowerCase())||
          user.FULLNAME.toLowerCase().includes(searchTerm.toLowerCase())||
          user.DAYOFBIRTH.toLowerCase().includes(searchTerm.toLowerCase())||
          user.EMAIL.toLowerCase().includes(searchTerm.toLowerCase())||
          user.PHONENUMBER.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  // Navigate to add user page
  const handleAddUserClick = () => {
    navigate('/add-user'); // Đường dẫn tới trang thêm người dùng
  };

  // Handle edit button click
  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`); // Đường dẫn tới trang chỉnh sửa người dùng
  };

  // Handle delete button click
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá người dùng này không?')) {
        fetch(`http://localhost:5000/delete-user/${id}`, {
            method: 'DELETE',
        })
        .then(async response => {
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Có lỗi xảy ra khi xóa người dùng');
            }
            
            // Nếu thành công
            fetchUsers(); // Refresh danh sách
            alert('Xóa người dùng thành công');
        })
        .catch(err => {
            // Hiển thị thông báo lỗi
            alert(err.message);
            console.error('Error deleting user:', err);
        });
    }
};

  // Handle view details button click
  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setSelectedUser(null);
  };

  return (
    <Box padding={3}>
      <h3>Quản lý người dùng</h3>

      <Button
        variant="contained"
        style={{ backgroundColor: '#FFA500', color: 'white', marginBottom: '15px' }}
        onClick={handleAddUserClick}
      >
        Thêm người dùng
      </Button>

      {/* Search input */}
      <TextField
        label="Tìm kiếm theo các thông tin của người dùng"
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
            <TableCell>Tên đầy đủ</TableCell>
            <TableCell>Số điện thoại</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Địa chỉ</TableCell>
            <TableCell>Ngày sinh</TableCell>
            <TableCell>Tên tài khoản</TableCell>
            <TableCell>Chức năng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.ID}>
              <TableCell>{user.ID}</TableCell>
              <TableCell>{user.FULLNAME}</TableCell>
              <TableCell>{user.PHONENUMBER}</TableCell>
              <TableCell>{user.EMAIL}</TableCell>
              <TableCell className='address-container'>{user.ADDRESS}</TableCell>
              <TableCell>{new Date(user.DAYOFBIRTH).toLocaleDateString('vi-VN')}</TableCell>
              <TableCell>{user.ACCOUNTNAME}</TableCell>
              <TableCell>
                <Button variant="outlined" onClick={() => handleViewDetails(user)}>
                  Xem Chi tiết
                </Button>
                <Button variant="outlined" onClick={() => handleEdit(user.ID)} style={{ marginLeft: '10px' }}>
                  Sửa
                </Button>
                <Button variant="outlined" onClick={() => handleDelete(user.ID)} style={{ marginLeft: '10px' }}>
                  Xoá
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* User details dialog */}
      {selectedUser && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
          <DialogContent>
            <Box padding={2}>
              <Typography variant="h6" gutterBottom>
                Thông tin người dùng
              </Typography>
              <Box display="flex" flexDirection="column" gap={1} marginBottom={2}>
                <Typography>ID: <strong>{selectedUser.ID}</strong></Typography>
                <Typography>Tên đầy đủ: <strong>{selectedUser.FULLNAME}</strong></Typography>
                <Typography>Số điện thoại: <strong>{selectedUser.PHONENUMBER}</strong></Typography>
                <Typography>Email: <strong>{selectedUser.EMAIL}</strong></Typography>
                <Typography>Địa chỉ: <strong>{selectedUser.ADDRESS}</strong></Typography>
                <Typography>Ngày sinh: <strong>{new Date(selectedUser.DAYOFBIRTH).toLocaleDateString('vi-VN')}</strong></Typography>
                <Typography>Tên tài khoản: <strong>{selectedUser.ACCOUNTNAME}</strong></Typography>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default UserManagement;
