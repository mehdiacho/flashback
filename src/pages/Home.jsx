import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Offcanvas,
  InputGroup,
  Nav
} from '../utils/bootstrap';
import {
  FaSearch,
  FaPlus,
  FaBars,
  FaEllipsisV,
  FaBookmark,
  FaSignOutAlt,
} from 'react-icons/fa';
import { getUserFlashbacks, getSharedFlashbacks } from '../db/Db';
import CustomNavbar from '../components/Navbar';

function Home() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [flashbacks, setFlashbacks] = useState([]);
  const [offcanvasShow, setOffcanvasShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFlashbacks();
  }, [user]);

  const fetchFlashbacks = async () => {
    if (user) {
      const ownedFlashbacks = await getUserFlashbacks(user.uid);
      const sharedFlashbacks = await getSharedFlashbacks(user.uid);
      setFlashbacks([...ownedFlashbacks, ...sharedFlashbacks]);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    // Implement search functionality here
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleOffcanvas = () => setOffcanvasShow(!offcanvasShow);

  return (
    <div className="d-flex flex-column min-vh-100 bg-body">
      <CustomNavbar />
      <Container className="flex-grow-1 py-4">
        <Row className="justify-content-center mb-4">
          <Col xs={12} sm={8} md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search your flashbacks..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </InputGroup>
          </Col>
          <Col xs="auto" className="mt-3 mt-sm-0">
            <Button variant="outline-primary" onClick={() => navigate('/add')}>
              <FaPlus className="me-2" />
              NEW FLASHBACK
            </Button>
          </Col>
          <Col xs="auto" className="mt-3 mt-sm-0">
            <Button variant="danger" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </Col>
        </Row>

        <Row className="justify-content-between align-items-center mb-3">
          <Col>
            <h4>Your Flashbacks</h4>
          </Col>
          <Col xs="auto">
            <Button variant="secondary" onClick={toggleOffcanvas}>
              <FaBars />
            </Button>
          </Col>
        </Row>

        <Row>
          {/* New Flashback Card */}
          <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card 
              className="h-100 d-flex flex-column align-items-center justify-content-center flashback-card"
              onClick={() => navigate('/add')}
              role="button"
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                <FaPlus size={48} className="mb-3 text-primary" />
                <Card.Title>New Flashback</Card.Title>
              </Card.Body>
            </Card>
          </Col>

          {/* Existing Flashbacks */}
          {flashbacks.map((flashback) => (
            <Col xs={12} sm={6} md={4} lg={3} key={flashback.id} className="mb-4">
              <Card className="h-100 d-flex flex-column flashback-card">
                <Card.Body className="flex-grow-1">
                  <Card.Title>{flashback.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {new Date(flashback.createdAt).toLocaleDateString()} • {flashback.sourceCount} sources
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-end">
                  <Button variant="secondary" size="sm">
                    <FaEllipsisV />
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Offcanvas Drawer */}
      <Offcanvas show={offcanvasShow} onHide={toggleOffcanvas} placement="start" data-bs-theme="">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="#my-flashbacks">
              <FaBookmark className="me-2" />
              My Flashbacks
            </Nav.Link>
            <Nav.Link as={Link} to="#shared-flashbacks">
              <FaBookmark className="me-2" />
              Shared with me
            </Nav.Link>
            <Nav.Link as={Link} to="#new-flashback">
              <FaPlus className="me-2" />
              New Flashback
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Footer */}
      <footer className="bg-light text-center py-3 mt-auto">
        © {new Date().getFullYear()} Flashback. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;