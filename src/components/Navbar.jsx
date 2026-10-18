import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShare, FaCog } from 'react-icons/fa';
import { AuthContext } from '../auth/AuthContext';
import { FlashbackIcon, FlashbackLogo3 } from '../pages/CustomIcons';
import ThemeToggle from './ThemeToggle';

const CustomNavbar = () => {
  const { logout } = useContext(AuthContext);

  const handleShare = () => {
    console.log('Share button clicked');
  };

  return (
    <BootstrapNavbar expand="lg" className="border-bottom">
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FlashbackLogo3 className="d-none d-sm-block me-2 flashback-icon" />
          <FlashbackIcon className="flashback-icon" />
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-start p-2">
            <Nav.Link 
              onClick={handleShare}
              className="d-flex align-items-center border border-secondary rounded w-25 p-2 mb-2"
            >
              <FaShare className="me-1" />
              <span className="d-lg-none ms-2">Share</span>
            </Nav.Link>

            <NavDropdown 
              align="end"
              title={
                <FaCog 
                color='grey'
                />
              }
              id="basic-nav-dropdown"
              className='border border-secondary text-secondary rounded w-25 mb-2 ps-2 pe-2 '
            >
              <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/account">Account</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
            
            <ThemeToggle/>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default CustomNavbar;
