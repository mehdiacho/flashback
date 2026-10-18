import { useState, useContext } from 'react';
import { Flashback } from '../data/Flashback';
import { Form, Button, Col, Card, FaPlus, FaThLarge, FaList, FaThList, FaImage, Row, FloatButton, BiSolidImageAdd, BiImageAdd } from '../utils/bootstrap';
import { AuthContext } from '../auth/AuthContext';

const NewFlashbackForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [createdBy, setCreatedBy] = useState({'name': '', 'id': ''});
    const [participants, setParticipants] = useState([]);
    const [createdAt, setCreatedAt] = useState(new Date());
    const [updatedAt, setUpdatedAt] = useState(new Date());
    const [viewMode, setViewMode] = useState('public');
    const [images, setImages] = useState(null);
    const [previewMode, setPreviewMode] = useState('grid');
    const [isPublic, setIsPublic] = useState(true);
    const { user } = useContext(AuthContext);

    const handleimagesChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
        
        if (invalidFiles.length > 0) {
            const invalidFileNames = invalidFiles.map(file => `• ${file.name}`).join('\n');
            alert(`The following file(s) were removed because they are not images:\n\n${invalidFileNames}\n\nOnly images files (JPG, PNG, GIF, etc.) are allowed.`);
            
            // Create a new FileList with only valid files
            const dataTransfer = new DataTransfer();
            validFiles.forEach(file => {
                dataTransfer.items.add(file);
            });
            e.target.files = dataTransfer.files;
        }

        setImages(validFiles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const flashback = new Flashback(title, description, owner, participants, createdAt, updatedAt, viewMode, images);
            alert('Flashback created successfully');
        } catch (error) {
            //console.error('Error creating flashback:', error);
            alert('Error creating flashback: ', error);
        }
    }

    const handleViewModeChange = (mode) => {
        setIsPublic(mode);
        setViewMode(mode ? 'public' : 'private');
    };

    const GridView = () => (
        <div className="d-flex flex-wrap gap-3">
            {images && images.map((file, index) => (
                <Card key={`grid-${index}`} style={{ width: '150px' }}>
                    <Card.Img
                        variant="top"
                        src={URL.createObjectURL(file)}
                        style={{ height: '150px', objectFit: 'cover' }}
                    />
                    <Card.Body className="p-2">
                        <small className="text-truncate d-block">{file.name}</small>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );

    const ListView = () => (
        <div className="border rounded">
            {images && images.map((file, index) => (
                <div 
                    key={`list-${index}`} 
                    className="d-flex align-items-center p-2 border-bottom"
                    style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}
                >
                    <div className="w-100">
                        <div className="fw-medium text-truncate">{file.name}</div>
                        <small className="text-muted">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • 
                            Last modified: {new Date(file.lastModified).toLocaleDateString()}
                        </small>
                    </div>
                </div>
            ))}
        </div>
    );

    const ListWithThumbsView = () => (
        <div className="border rounded">
            {images && images.map((file, index) => (
                <div 
                    key={`thumb-${index}`} 
                    className="d-flex align-items-center p-2 border-bottom"
                    style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}
                >
                    <div className="flex-grow-1">
                        <div className="fw-medium">{file.name}</div>
                        <small className="text-muted">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • 
                            Last modified: {new Date(file.lastModified).toLocaleDateString()}
                        </small>
                    </div>
                    <img 
                        src={URL.createObjectURL(file)} 
                        alt={file.name}
                        className=" rounded-circle"
                        style={{ 
                            height: '5rem', 
                            width: '5rem', 
                            objectFit: 'cocer'
                        }} 
                    />
                </div>
            ))}
        </div>
    );

    return (
        <div className='p-3'>
            <h1 className='text-center mb-3'>New Flashback</h1>
            <Form>
                <Form.Group className="mb-3" controlId="title">
                    <Form.Label className="fw-bold fs-6">Title</Form.Label>
                    <Form.Control type="text" size='lg' /*plaintext readOnly*/ placeholder="Flashback Title" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                    <Form.Label className="fw-bold fs-6">Description</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Flashback Description" />
                </Form.Group>

                <Col className="d-flex flex-row gap-3 rounded p-3 border-primary  justify-content-around bg-primary bg-opacity-10">
                    <Form.Group className=" border-danger rounded p-0 flex-grow-1 d-flex flex-column align-items-center justify-content-center m-0" controlId="owner">
                        <Form.Label className="fw-bold fs-6 p-0 m-0">Created By</Form.Label>
                        <img 
                            src={user.photoURL} 
                            alt={user.displayName}
                            className="p-0 rounded-circle"
                            style={{ 
                                height: '3rem', 
                                width: '3rem', 
                                objectFit: 'cover'
                            }} 
                        />
                        <Form.Control type='text' className="text-center p-0 fw-bold fs-5" placeholder="Username" plaintext readOnly value={user.displayName} />
                        <Form.Control type='text' className="text-center p-0" placeholder="User ID" plaintext readOnly value={user.uid} />    
                    </Form.Group>

                    <Form.Group className=" border-danger rounded p-0 flex-grow-1 d-flex flex-column align-items-center justify-content-center" controlId="createdAt">
                        <Form.Label className="fw-bold fs-6 mb-3">Creation Date</Form.Label>
                        <Form.Control type='text' className="text-center mb-2 fw-bold fs-5" placeholder="Date of Creation" value={new Date().toLocaleDateString()} plaintext readOnly />
                        <Form.Control type='text' className="text-center fw-bold fs-5" placeholder="Date of Creation" value={new Date().toLocaleTimeString()} plaintext readOnly />
                    </Form.Group>
                </Col>
                <br/>

                <Form.Group className="mb-3" controlId="participants">
                    <Form.Label className="fw-bold fs-6" >Participants</Form.Label>
                    <Form.Control type='text' rows={3} placeholder="Tag People" />
                    <Form.Text className="text-muted">
                        People you tag will be able to see this Flashback
                    </Form.Text>
                </Form.Group>


                {/* <Form.Group className="mb-3" controlId="viewMode">
                <Form.Label>View Mode</Form.Label>
                    <Form.Check type="radio" id="viewModePublic" label="Public" reverse  name='viewMode' />
                    <Form.Check type="radio" id="viewModePrivate" label="Private" reverse  name='viewMode' />
                </Form.Group> */}

                <Form.Group className="mb-3">
                <Form.Label className="fw-bold fs-6">View Mode</Form.Label>
                    <Form.Check type="switch" id="viewModePublicSwitch" label="Public" reverse checked={isPublic} onChange={() => handleViewModeChange(!isPublic)}/>
                    <Form.Check type="switch" id="viewModePrivateSwitch" label="Private" reverse checked={!isPublic} onChange={() => handleViewModeChange(!isPublic)}/>
                </Form.Group>

                {/* <Form.Group className="mb-3" controlId="viewMode">
                    <Form.Label>View Mode</Form.Label>
                    <Form.Select aria-label="Default select example" size='sm'>
                        <option>Select View Mode</option>
                        <option value={true}>Public</option>
                        <option value={false}>Private</option>
                    </Form.Select>
                </Form.Group> */}

            

                <Form.Group className="mb-3" >
                    <Row className="d-flex justify-content-between align-items-center mb-3">
                        <Col>
                            <Form.Label className="mb-0 fs-1">Images</Form.Label>
                        </Col>
                        
                        <Col>
                            <div className="btn-group">
                                <Button 
                                    variant={previewMode === 'grid' ? 'primary' : 'outline-primary'}
                                onClick={() => setPreviewMode('grid')}
                                title="Grid view"
                            >
                                <FaThLarge />
                            </Button>
                            <Button 
                                variant={previewMode === 'listWithThumbs' ? 'primary' : 'outline-primary'}
                                onClick={() => setPreviewMode('listWithThumbs')}
                                title="List with thumbnails"
                            >
                                <FaThList />
                            </Button>
                            <Button 
                                variant={previewMode === 'list' ? 'primary' : 'outline-primary'}
                                onClick={() => setPreviewMode('list')}
                                title="List view"
                            >
                                <FaList />
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    {/* Upload Card */}
                    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <Card className="btn h-100 d-flex flex-column align-items-center justify-content-center bg-primary bg-opacity-10" 
                              onClick={() => document.getElementById('imagesInput').click()}>
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
                                <FaPlus size={48} className="text-secondary mb-3" />
                                <Card.Title>Upload images</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Preview Section */}
                    {images && images.length > 0 && (
                        <div className="mb-3">
                            {previewMode === 'grid' && <GridView />}
                            {previewMode === 'list' && <ListView />}
                            {previewMode === 'listWithThumbs' && <ListWithThumbsView />}
                        </div>
                    )}

                    <Form.Control 
                        id='imagesInput' 
                        type='file' 
                        accept='images/jpeg,images/png,images/gif,images/webp' 
                        multiple 
                        onChange={handleimagesChange}
                        className="d-none"
                    />
                </Form.Group>

                <FloatButton.Group
                size='large'
                shape='square'
                icon={<FaPlus />}
                trigger="click"
                type="primary">
                    <FloatButton
                    
                    htmlType=''
                    shape="square"
                    tooltip={<div>Add Image</div>}
                    icon={<BiSolidImageAdd />}
                    type="primary"
                    style={{
                        insetInlineEnd: 24,
                    }}
                    />
                </FloatButton.Group>
                
                
                    
            </Form>
        </div>
    );
}

export default NewFlashbackForm;