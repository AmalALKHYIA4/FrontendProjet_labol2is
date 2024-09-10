import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserThese = () => {
    const [theses, setTheses] = useState([]);
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    // Fonction pour récupérer les thèses de l'utilisateur
    const fetchTheses = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/theses/user-or-contributor/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setTheses(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des thèses:', error);
            toast.error('Erreur lors de la récupération des thèses');
        }
    };

    // Utiliser useEffect pour récupérer les thèses lorsque le composant est monté
    useEffect(() => {
        fetchTheses();
    }, [currentUser.id, accessToken]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/theses/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            toast.success('Thèse supprimée avec succès');
            fetchTheses(); // Recharger la liste des thèses
        } catch (error) {
            console.error('Erreur lors de la suppression de la thèse:', error);
            toast.error('Erreur lors de la suppression de la thèse');
        }
    };

    const handleEdit = (id) => {
        navigate(`/user/UserEditThese/${id}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Thèses</h1>
            <button
                onClick={() => navigate('/user/UserCreateThèse')}
                className="mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Ajouter une Thèse
            </button>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {theses.length ? (
                        theses.map(these => (
                            <tr key={these.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{these.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{these.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {these.doi ? (
                                        <a
                                            href={`https://doi.org/${these.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                const isValidDOI = these.doi.startsWith('10.');
                                                if (!isValidDOI) {
                                                    e.preventDefault();
                                                    alert('Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.');
                                                }
                                            }}
                                        >
                                            {these.doi}
                                        </a>
                                    ) : (
                                        'Pas de DOI disponible'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{these.lieu}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(these.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(these.id)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(these.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4">Aucune thèse disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserThese;
