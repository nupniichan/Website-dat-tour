import React from 'react';
import { Navbar, Nav, Form, FormControl, Button, Badge } from 'react-bootstrap';
import { Bell, MessageSquare, ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <Navbar bg="white" expand="lg" className="border-bottom">
      <Navbar.Brand href="#home" className="d-flex align-items-center" style={{ marginLeft: '20px' }}>
        <span style={{ color: 'orange' }} className="fw-bold fs-4">Trang quản lý</span>
        <span className="ms-2 fw-bold">VietTour</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Button variant="link" className="nav-link">
            <i className="bi bi-list fs-4"></i>
          </Button>
        </Nav>
        <Nav>
          <Nav.Link href="#profile" className="d-flex align-items-center" style={{marginRight: '20px'}}>
            <img
              src="src/img/icon/user.png"
              alt="Profile"
              className="rounded-circle me-2"
              width="30"
              height="30"
            />
            <span>Chào mừng admin</span>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;