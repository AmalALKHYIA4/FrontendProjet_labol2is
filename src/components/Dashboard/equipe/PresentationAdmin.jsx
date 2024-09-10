import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

// Fonction pour enlever les balises HTML
const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

// Fonction pour tronquer le texte
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

const PresentationAdmin = () => {
    const [presentations, setPresentations] = useState([]);
    const [teams, setTeams] = useState([]); // Nouvel état pour les équipes
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(null); // État pour gérer les éléments développés

    useEffect(() => {
        fetchPresentations();
        fetchTeams(); // Appel à la récupération des équipes
    }, [accessToken]);

    const fetchPresentations = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/presentations', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (Array.isArray(response.data)) {
                setPresentations(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau', response.data);
                setError('Erreur de données : Les données reçues ne sont pas un tableau');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? (error.response.data.message || 'Erreur inconnue du serveur') + ' - Code: ' + error.response.status
                : error.message || 'Erreur inconnue';
            console.error('Erreur lors de la récupération des présentations', errorMessage);
            setError('Erreur lors de la récupération des présentations : ' + errorMessage);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/equipe', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (Array.isArray(response.data)) {
                setTeams(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau', response.data);
                setError('Erreur de données : Les données reçues ne sont pas un tableau');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? (error.response.data.message || 'Erreur inconnue du serveur') + ' - Code: ' + error.response.status
                : error.message || 'Erreur inconnue';
            console.error('Erreur lors de la récupération des équipes', errorMessage);
            setError('Erreur lors de la récupération des équipes : ' + errorMessage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette présentation ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/presentations/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setPresentations(presentations.filter(presentation => presentation.id !== id));
                toast.success('Présentation supprimée avec succès');
            } catch (error) {
                console.error('Erreur lors de la suppression de la présentation', error);
                toast.error('Erreur lors de la suppression de la présentation');
            }
        }
    };

    const toggleExpand = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    // Fonction pour obtenir le nom de l'équipe à partir de l'id
    const getTeamNameById = (id) => {
        const team = teams.find(team => team.id === id);
        return team ? team.name : 'Inconnu';
    };

    return (
        <div>
            <h1>Gestion de la Présentation de l’Équipe</h1>
            <Link to="/dashboard/PresentationCreate" className="btn btn-primary mb-4">Ajouter une Présentation</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contenu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipe</th> {/* Nouvelle colonne pour le nom de l'équipe */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {presentations.length ? (
                        presentations.map(presentation => (
                            <tr key={presentation.id}>
                                <td className="px-6 py-4 whitespace-nowrap table-cell">{stripHtmlTags(presentation.title)}</td>
                                <td className="px-6 py-4 whitespace-nowrap table-cell">
                                    {expanded === presentation.id ? 
                                        stripHtmlTags(presentation.content) 
                                        : truncateText(stripHtmlTags(presentation.content), 50)} {/* Longueur réduite à 50 caractères */}
                                    <button onClick={() => toggleExpand(presentation.id)} className="ml-2 text-blue-500">
                                        {expanded === presentation.id ? 'Réduire' : 'Lire plus'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap table-cell">{getTeamNameById(presentation.team_id)}</td> {/* Affichage du nom de l'équipe */}
                                <td className="px-6 py-4 whitespace-nowrap actions">
                                    <Link to={`/dashboard/PresentationEdit/${presentation.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(presentation.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">Aucune présentation disponible</td> {/* Colspan mis à jour pour inclure la nouvelle colonne */}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PresentationAdmin;
