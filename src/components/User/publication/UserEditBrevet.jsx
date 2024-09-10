import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserEditBrevet = () => {
    const [title, setTitle] = useState('');
    const [doi, setDoi] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);
    const { id } = useParams();

    // Fetch members data
    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/members', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
            setError('Error fetching members');
            toast.error('Error fetching members');
        }
    };

    // Fetch brevet details for editing
    const fetchBrevetDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/brevets/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const brevet = response.data;
            setTitle(brevet.title);
            setDoi(brevet.doi);

            const selectedMembers = brevet.author.split(', ');
            const selectedMemberIds = members
                .filter(member => selectedMembers.includes(member.name))
                .map(member => member.user_id);

            setSelectedAuthors(selectedMembers);
            setSelectedAuthorIds(selectedMemberIds);
        } catch (error) {
            console.error('Error fetching brevet details:', error);
            setError('Error fetching brevet details');
            toast.error('Error fetching brevet details');
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [accessToken]);

    useEffect(() => {
        if (members.length > 0) {
            fetchBrevetDetails();
        }
    }, [members]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedAuthorIds.length === 0) {
            setError('Please select at least one author.');
            toast.error('Please select at least one author.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/api/brevetsUser/${id}`, {
                title,
                author: selectedAuthors.join(', '),
                doi,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            console.log('Brevet updated:', response.data);
            toast.success('Brevet updated successfully');
            navigate('/user/UserBrevet');
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Error updating brevet:', error.response.data);
                setError(`Error updating brevet: ${error.response.data.message || 'Invalid data provided.'}`);
                toast.error(`Error updating brevet: ${error.response.data.message || 'Invalid data provided.'}`);
            } else {
                console.error('Error updating brevet:', error.message);
                setError('Error updating brevet');
                toast.error('Error updating brevet');
            }
        }
    };

    const handleAuthorSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const names = selectedOptions.map(option => option.value);
        const ids = selectedOptions.map(option => option.getAttribute('data-id'));

        setSelectedAuthors(names);
        setSelectedAuthorIds(ids);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Brevet</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <p className="text-sm text-gray-500 mb-4">Brevet ID: {id}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Authors</label>
                    <select
                        multiple
                        value={selectedAuthors}
                        onChange={handleAuthorSelection}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        {members.map(member => (
                            <option key={member.id} value={member.name} data-id={member.user_id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                        To select multiple authors, hold down the <strong>Ctrl</strong> key (or <strong>Cmd</strong> on Mac) while clicking the names.
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">DOI</label>
                    <input
                        type="text"
                        value={doi}
                        onChange={(e) => setDoi(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Update
                </button>
            </form>
        </div>
    );
};

export default UserEditBrevet;
