import { useState } from 'react';
import { Flashback } from '../data/Flashback';
import { NewFlashbackForm, Navbar } from '../components/Directory';
import DummyPage from '../components/DummyPage';

const NewFlashback = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [owner, setOwner] = useState({'name': '', 'id': ''});
    const [participants, setParticipants] = useState([]);
    const [createdAt, setCreatedAt] = useState(new Date());
    const [updatedAt, setUpdatedAt] = useState(new Date());
    const [viewMode, setViewMode] = useState('public');
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            const flashback = new Flashback(title, description, owner, participants, createdAt, updatedAt, viewMode, image);
            alert('Flashback created successfully');
        } catch (error) {
            //console.error('Error creating flashback:', error);
            alert('Error creating flashback: ', error);
        }
    }

    return (

        <div className='shadow-sm bg-body'>
            <Navbar />
            <NewFlashbackForm />
            {/* <DummyPage /> */}
        </div>
               
    );
}

export default NewFlashback;