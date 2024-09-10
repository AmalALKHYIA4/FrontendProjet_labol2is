import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserHabilitation = () => {
    const [habilitations, setHabilitations] = useState([]);
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    // Fonction pour récupérer les habilitations de l'utilisateur
    const fetchHabilitations = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/habilitations/user-or-contributor/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setHabilitations(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des habilitations:', error);
            toast.error('Erreur lors de la récupération des habilitations');
        }
    };

    // Utiliser useEffect pour récupérer les habilitations lorsque le composant est monté
    useEffect(() => {
        fetchHabilitations();
    }, [currentUser.id, accessToken]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/habilitations/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            toast.success('Habilitation supprimée avec succès');
            fetchHabilitations(); // Recharger la liste des habilitations
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'habilitation:', error);
            toast.error('Erreur lors de la suppression de l\'habilitation');
        }
    };

    const handleEdit = (id) => {
        navigate(`/dashboard/habilitation/edit/${id}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Habilitations</h1>
            <button
                onClick={() => navigate('/user/UserCreateHabilitation')}
                className="mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Ajouter une Habilitation
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
                    {habilitations.length ? (
                        habilitations.map(habilitation => (
                            <tr key={habilitation.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{habilitation.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{habilitation.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {habilitation.doi ? (
                                        <a
                                            href={`https://doi.org/${habilitation.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                const isValidDOI = habilitation.doi.startsWith('10.');
                                                if (!isValidDOI) {
                                                    e.preventDefault();
                                                    alert('Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.');
                                                }
                                            }}
                                        >
                                            {habilitation.doi}
                                        </a>
                                    ) : (
                                        'Pas de DOI disponible'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{habilitation.lieu}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(habilitation.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(habilitation.id)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(habilitation.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4">Aucune habilitation disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserHabilitation;
