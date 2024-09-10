import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill editor style

const CreateDescription = () => {
    const [content, setContent] = useState('');
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error('Content is required.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/home-descriptions', { content }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 201) {
                toast.success('Description added successfully');
                navigate('/dashboard/AdminHomeDescription');
            } else {
                throw new Error('Unexpected server response');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? `${error.response.data.message || 'Unknown server error'} - Code: ${error.response.status}`
                : error.message || 'Unknown error';
            
            console.error('Error adding description:', errorMessage);
            toast.error(`Error adding description: ${errorMessage}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Add Description</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="content" className="block text-gray-700">Content</label>
                    <ReactQuill
                        id="content"
                        value={content}
                        onChange={setContent}
                        placeholder="Enter content here..."
                        className="border px-4 py-2 w-full"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add
                </button>
            </form>
        </div>
    );
};

export default CreateDescription;
