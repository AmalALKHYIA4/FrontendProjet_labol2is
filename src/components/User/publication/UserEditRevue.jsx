import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserEditRevue = () => {
    const [title, setTitle] = useState('');
    const [DOI, setDOI] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);
    const { id } = useParams();

    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/members', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setMembers(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des membres:', error);
            setError('Erreur lors de la récupération des membres');
            toast.error('Erreur lors de la récupération des membres');
        }
    };

    const fetchRevueDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/revuesUsers/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const revue = response.data;
            setTitle(revue.title);
            setDOI(revue.DOI);

            const selectedMembers = revue.author.split(', ');
            const selectedMemberIds = members
                .filter(member => selectedMembers.includes(member.name))
                .map(member => member.user_id);

            setSelectedAuthors(selectedMembers);
            setSelectedAuthorIds(selectedMemberIds);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de la revue:', error);
            setError('Erreur lors de la récupération des détails de la revue');
            toast.error('Erreur lors de la récupération des détails de la revue');
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [accessToken]);

    useEffect(() => {
        if (members.length > 0) {
            fetchRevueDetails();
        }
    }, [members]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedAuthorIds.length === 0) {
            setError('Veuillez sélectionner au moins un auteur.');
            toast.error('Veuillez sélectionner au moins un auteur.');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8000/api/revues/${id}`, {
                title,
                author: selectedAuthors.join(', '),
                DOI,
                id_user: selectedAuthorIds.join(','),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            console.log('Revue mise à jour:', response.data);
            toast.success('Revue mise à jour avec succès');
            navigate('/user/UserRevues');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la revue:', {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                } : 'Aucune réponse disponible',
                config: error.config
            });
            setError('Erreur lors de la mise à jour de la revue');
            toast.error('Erreur lors de la mise à jour de la revue');
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
            <h1 className="text-2xl font-bold mb-4">Modifier une Revue</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <p className="text-sm text-gray-500 mb-4">ID de la revue : {id}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Auteur(s)</label>
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
                        Pour sélectionner plusieurs auteurs, maintenez la touche <strong>Ctrl</strong> (ou <strong>Cmd</strong> sur Mac) enfoncée tout en cliquant sur les noms souhaités.
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">DOI</label>
                    <input
                        type="text"
                        value={DOI}
                        onChange={(e) => setDOI(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Mettre à jour
                </button>
            </form>
        </div>
    );
};

export default UserEditRevue;
