import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserEditThese = () => {
    const [title, setTitle] = useState('');
    const [DOI, setDOI] = useState('');
    const [lieu, setLieu] = useState(''); // New attribute for location
    const [date, setDate] = useState(''); // New attribute for date
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

    const fetchTheseDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/theses/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const these = response.data;
            setTitle(these.title);
            setDOI(these.doi);
            setLieu(these.lieu); // Set lieu
            setDate(these.date); // Set date

            const selectedMembers = these.author.split(', ');
            const selectedMemberIds = members
                .filter(member => selectedMembers.includes(member.name))
                .map(member => member.user_id);

            setSelectedAuthors(selectedMembers);
            setSelectedAuthorIds(selectedMemberIds);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de la thèse:', error);
            setError('Erreur lors de la récupération des détails de la thèse');
            toast.error('Erreur lors de la récupération des détails de la thèse');
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [accessToken]);

    useEffect(() => {
        if (members.length > 0) {
            fetchTheseDetails();
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
            const payload = {
                title,
                author: selectedAuthors.join(', '),
                doi: DOI,
                id_user: selectedAuthorIds.join(','),
                lieu, // Include lieu
                date, // Include date
            };

            console.log('Payload envoyé:', payload); // Ajoutez cette ligne pour voir le payload envoyé

            const response = await axios.put(`http://localhost:8000/api/theses/${id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            console.log('Réponse de la mise à jour:', response.data);
            toast.success('Thèse mise à jour avec succès');
            navigate('/user/UserThèse');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la thèse:', error);

            // Ajoutez ce log pour afficher la réponse d'erreur en détail
            if (error.response) {
                console.error('Détails de l\'erreur:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers,
                });
            } else {
                console.error('Aucune réponse disponible:', error.message);
            }

            setError('Erreur lors de la mise à jour de la thèse');
            toast.error('Erreur lors de la mise à jour de la thèse');
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
            <h1 className="text-2xl font-bold mb-4">Modifier une Thèse</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <p className="text-sm text-gray-500 mb-4">ID de la thèse : {id}</p>
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
                <div>
                    <label className="block text-sm font-medium mb-1">Lieu</label>
                    <input
                        type="text"
                        value={lieu}
                        onChange={(e) => setLieu(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
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

export default UserEditThese;
