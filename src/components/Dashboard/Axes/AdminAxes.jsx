import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';
import parse from 'html-react-parser';

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

const AdminAxes = () => {
    const [axes, setAxes] = useState([]);
    const [teams, setTeams] = useState([]); // Nouvel état pour les équipes
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(null); // État pour gérer les éléments développés

    useEffect(() => {
        fetchAxes();
        fetchTeams(); // Appel à la récupération des équipes
    }, [accessToken]);

    const fetchAxes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/axes', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (Array.isArray(response.data)) {
                setAxes(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau', response.data);
                setError('Erreur de données : Les données reçues ne sont pas un tableau');
            }
        } catch (error) {
            const errorMessage = error.response 
                ? (error.response.data.message || 'Erreur inconnue du serveur') + ' - Code: ' + error.response.status
                : error.message || 'Erreur inconnue';
            console.error('Erreur lors de la récupération des axes', errorMessage);
            setError('Erreur lors de la récupération des axes : ' + errorMessage);
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
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet axe ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/axes/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setAxes(axes.filter(axe => axe.id !== id));
                toast.success('Axe supprimé avec succès');
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'axe', error);
                toast.error('Erreur lors de la suppression de l\'axe');
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
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Gestion des Axes de Recherche</h1>
            <Link to="/dashboard/AxeCreate" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
                Ajouter un Axe
            </Link>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipe</th> {/* Nouvelle colonne pour le nom de l'équipe */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {axes.length ? (
                        axes.map(axe => (
                            <tr key={axe.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parse(axe.title)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {expanded === axe.id ? 
                                        stripHtmlTags(axe.content) 
                                        : truncateText(stripHtmlTags(axe.content), 50)} {/* Longueur réduite à 50 caractères */}
                                    <button onClick={() => toggleExpand(axe.id)} className="ml-2 text-blue-500">
                                        {expanded === axe.id ? 'Réduire' : 'Lire plus'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTeamNameById(axe.team_id)}</td> {/* Affichage du nom de l'équipe */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link to={`/dashboard/AxeEdit/${axe.id}`} className="text-blue-600 hover:text-blue-800 mr-4">
                                        Modifier
                                    </Link>
                                    <button onClick={() => handleDelete(axe.id)} className="text-red-600 hover:text-red-800">
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">Aucun axe disponible</td> {/* Colspan mis à jour pour inclure la nouvelle colonne */}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminAxes;
