import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const HabilitationEdit = () => {
    const [title, setTitle] = useState('');
    const [doi, setDoi] = useState('');
    const [lieu, setLieu] = useState('');
    const [date, setDate] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);
    const { id } = useParams(); // Get the habilitation ID from the URL

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch members for the select input
                const membersResponse = await axios.get('http://localhost:8000/api/members', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setMembers(membersResponse.data);

                if (id) {
                    // Fetch habilitation data for editing
                    const habilitationResponse = await axios.get(`http://localhost:8000/api/habilitations/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    const habilitation = habilitationResponse.data;
                    setTitle(habilitation.title);
                    setDoi(habilitation.doi);
                    setLieu(habilitation.lieu);
                    setDate(habilitation.date);
                    setSelectedAuthors(habilitation.author.split(', '));
                    setSelectedAuthorIds(habilitation.id_user.split(','));
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
                setError('Erreur lors de la récupération des données');
                toast.error('Erreur lors de la récupération des données');
            }
        };

        fetchData();
    }, [accessToken, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedAuthorIds.length === 0) {
            setError('Veuillez sélectionner au moins un auteur.');
            toast.error('Veuillez sélectionner au moins un auteur.');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/habilitations/${id}`, {
                title,
                doi,
                author: selectedAuthors.join(', '),
                id_user: selectedAuthorIds.join(','),
                lieu,
                date,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            toast.success('Habilitation modifiée avec succès');
            navigate('/dashboard/habilitation');
        } catch (error) {
            console.error('Erreur lors de la modification de l\'habilitation:', error.response?.data || error.message);
            setError(`Erreur lors de la modification de l'habilitation: ${error.response?.data?.message || error.message}`);
            toast.error(`Erreur lors de la modification de l'habilitation: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleAuthorSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const names = selectedOptions.map(option => option.textContent);
        const ids = selectedOptions.map(option => option.getAttribute('data-id'));

        setSelectedAuthors(names);
        setSelectedAuthorIds(ids);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier une Habilitation</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            {selectedAuthors.length > 0 && (
                <div className="mb-4">
                    <strong>Auteurs sélectionnés :</strong> {selectedAuthors.join(', ')}
                </div>
            )}

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
                        value={selectedAuthorIds}
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
                        value={doi}
                        onChange={(e) => setDoi(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Lieu</label>
                    <input
                        type="text"
                        value={lieu}
                        onChange={(e) => setLieu(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Modifier
                </button>
            </form>
        </div>
    );
};

export default HabilitationEdit;
