import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserEditRapport = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState(''); // Ajouter l'état pour le résumé
    const [DOI, setDOI] = useState('');
    const [members, setMembers] = useState([]); // Liste des membres
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]); // IDs des membres sélectionnés
    const [selectedAuthors, setSelectedAuthors] = useState([]); // Noms des membres sélectionnés
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);
    const { id } = useParams(); // Récupérer l'ID du rapport depuis les paramètres d'URL

    // Fonction pour récupérer les informations des membres
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

    // Fonction pour récupérer les informations du rapport à éditer
    const fetchRapportDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/reports/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const rapport = response.data;
            setTitle(rapport.title);
            setDOI(rapport.DOI);
            setSummary(rapport.summary); // Ajouter le résumé

            const selectedMembers = rapport.author.split(', ');
            const selectedMemberIds = members
                .filter(member => selectedMembers.includes(member.name))
                .map(member => member.user_id);

            setSelectedAuthors(selectedMembers);
            setSelectedAuthorIds(selectedMemberIds);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails du rapport:', error);
            setError('Erreur lors de la récupération des détails du rapport');
            toast.error('Erreur lors de la récupération des détails du rapport');
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [accessToken]);

    useEffect(() => {
        if (members.length > 0) {
            fetchRapportDetails();
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
            const response = await axios.put(`http://localhost:8000/api/reports/${id}`, {
                title,
                summary, // Ajouter le résumé
                author: selectedAuthors.join(', '),
                DOI,
                id_user: selectedAuthorIds.join(','),  // Convertir le tableau en chaîne
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            console.log('Rapport mis à jour:', response.data);
            toast.success('Rapport mis à jour avec succès');
            navigate('/user/UserRapport');
        } catch (error) {
            console.error('Erreur lors de la mise à jour du rapport:', {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                } : 'Aucune réponse disponible',
                config: error.config
            });
            setError('Erreur lors de la mise à jour du rapport');
            toast.error('Erreur lors de la mise à jour du rapport');
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
            <h1 className="text-2xl font-bold mb-4">Modifier un Rapport</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <p className="text-sm text-gray-500 mb-4">ID du rapport : {id}</p>
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
                    <label className="block text-sm font-medium mb-1">Résumé</label>
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
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

export default UserEditRapport;
