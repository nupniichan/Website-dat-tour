import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, Typography, TextField, Avatar, Grid, Paper, IconButton, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Person,
  Email,
  Phone,
  Home,
  Cake,
  AccountCircle,
  ArrowBack,
  Badge,
  VerifiedUser
} from '@mui/icons-material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

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
    setPage(1); // Reset về trang 1 khi tìm kiếm
  }, [searchTerm, users]);

  // Tính toán các giá trị cho phân trang
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

  // Xử lý khi thay đổi trang
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

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
          {currentUsers.map((user) => (
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

      {/* Thêm component phân trang */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination 
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          showFirstButton 
          showLastButton
        />
      </Box>

      {/* User details dialog */}
      {selectedUser && (
        <Dialog 
          open={true} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton onClick={handleCloseDialog} size="small">
                <ArrowBack />
              </IconButton>
              <Typography variant="h6">Chi tiết người dùng</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              {/* Thông tin cá nhân */}
              <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Badge /> Thông tin cá nhân
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          bgcolor: 'primary.main',
                          fontSize: '2rem'
                        }}
                      >
                        {selectedUser.FULLNAME.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {selectedUser.FULLNAME}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {selectedUser.ID}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{selectedUser.EMAIL}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Số điện thoại</Typography>
                        <Typography variant="body1">{selectedUser.PHONENUMBER}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Home color="primary" sx={{ mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Địa chỉ</Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {selectedUser.ADDRESS}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Cake color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Ngày sinh</Typography>
                        <Typography variant="body1">
                          {new Date(selectedUser.DAYOFBIRTH).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Thông tin tài khoản */}
              <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VerifiedUser /> Thông tin tài khoản
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountCircle color="primary" />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">Tên tài khoản</Typography>
                        <Typography variant="body1" fontWeight="500">{selectedUser.ACCOUNTNAME}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: 'background.paper', 
                      borderRadius: 1,
                      border: '1px dashed rgba(0, 0, 0, 0.12)'
                    }}>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Thông tin tài khoản được bảo mật theo quy định
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default UserManagement;
