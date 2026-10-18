import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { FaPlus, FaImage, FaLink } from 'react-icons/fa';
import CustomNavbar from '../components/Navbar';

function NewFlashback() {
  const [title, setTitle] = useState('');
  const [sources, setSources] = useState([]);

  const handleAddSource = (type) => {
    setSources([...sources, { type, url: '', id: Date.now() }]);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-body">
      <CustomNavbar />
      <Container className="py-4 flex-grow-1">
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <Form>
              <Form.Group className="mb-4">
                <Form.Label>Flashback Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-control-lg"
                />
              </Form.Group>

              <div className="mb-4">
                <h5>Sources</h5>
                {sources.map((source, index) => (
                  <Card key={source.id} className="mb-3 bg-body-tertiary border">
                    <Card.Body>
                      <InputGroup>
                        <InputGroup.Text>
                          {source.type === 'image' ? <FaImage /> : <FaLink />}
                        </InputGroup.Text>
                        <Form.Control
                          type="url"
                          placeholder={`Enter ${source.type} URL`}
                        />
                      </InputGroup>
                    </Card.Body>
                  </Card>
                ))}
              </div>

              <Row className="g-3">
                <Col>
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => handleAddSource('image')}
                  >
                    <FaImage className="me-2" />
                    Add Image
                  </Button>
                </Col>
                <Col>
                  <Button
                    variant="outline-primary"
                    className="w-100"
                    onClick={() => handleAddSource('link')}
                  >
                    <FaLink className="me-2" />
                    Add Link
                  </Button>
                </Col>
              </Row>

              <div className="d-grid gap-2 mt-4">
                <Button variant="primary" size="lg" type="submit">
                  Create Flashback
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <footer className="py-3 text-center">
        © {new Date().getFullYear()} Flashback. All rights reserved.
      </footer>
    </div>
  );
}

export default NewFlashback;