import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { toast } from 'react-toastify';

// Function to strip HTML tags
const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

// Function to truncate text
const truncateText = (text, maxLength) => {
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
};

const AdminHomeDescription = () => {
    const [descriptions, setDescriptions] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(null); // State to manage expanded items

    useEffect(() => {
        fetchDescriptions();
    }, [accessToken]);

    const fetchDescriptions = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/home-descriptions', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (Array.isArray(response.data)) {
                setDescriptions(response.data);
            } else {
                console.error('Received data is not an array', response.data);
                setError('Data error: Received data is not an array');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? `${error.response.data.message || 'Unknown server error'} - Code: ${error.response.status}`
                : error.message || 'Unknown error';
            console.error('Error fetching descriptions', errorMessage);
            setError(`Error fetching descriptions: ${errorMessage}`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this description?')) {
            try {
                await axios.delete(`http://localhost:8000/api/home-descriptions/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setDescriptions(descriptions.filter(description => description.id !== id));
                toast.success('Description deleted successfully');
            } catch (error) {
                console.error('Error deleting description', error);
                toast.error('Error deleting description');
            }
        }
    };

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Manage Descriptions</h1>
            <Link to="/dashboard/CreateDescription" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
                Add Description
            </Link>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {descriptions.length ? (
                        descriptions.map(description => (
                            <tr key={description.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {expanded === description.id 
                                        ? stripHtmlTags(description.content) 
                                        : truncateText(stripHtmlTags(description.content), 50)} {/* Shortened to 50 characters */}
                                    <button 
                                        onClick={() => toggleExpand(description.id)} 
                                        className="ml-2 text-blue-500"
                                    >
                                        {expanded === description.id ? 'Collapse' : 'Read more'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link 
                                        to={`/dashboard/EditDescription/${description.id}`} 
                                        className="text-blue-600 hover:text-blue-800 mr-4"
                                    >
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(description.id)} 
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center py-4">No descriptions available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminHomeDescription;
