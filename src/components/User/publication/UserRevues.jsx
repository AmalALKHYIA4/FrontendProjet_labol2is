import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserRevue = () => {
    const [revues, setRevues] = useState([]);
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    // Fonction pour récupérer les revues de l'utilisateur
    const fetchRevues = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/revues/user-or-contributor/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setRevues(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des revues:', error);
            toast.error('Erreur lors de la récupération des revues');
        }
    };

    // Utiliser useEffect pour récupérer les revues lorsque le composant est monté
    useEffect(() => {
        fetchRevues();
    }, [currentUser.id, accessToken]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/revues/${id}`);
            toast.success('Revue supprimée avec succès');
            fetchRevues(); // Recharger la liste des revues
        } catch (error) {
            console.error('Erreur lors de la suppression de la revue:', error);
            toast.error('Erreur lors de la suppression de la revue');
        }
    };

    const handleEdit = (id) => {
        navigate(`/user/UserEditRevue/${id}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Revues</h1>
            <button
                onClick={() => navigate('/user/UserCreateRevue')}
                className="mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Ajouter une Revue
            </button>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {revues.length ? (
                        revues.map(revue => (
                            <tr key={revue.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{revue.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{revue.author}</td>
                                <td>
                                    {revue.DOI ? (
                                        <a
                                            href={`https://doi.org/${revue.DOI}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                const isValidDOI = revue.DOI.startsWith('10.');
                                                if (!isValidDOI) {
                                                    e.preventDefault();
                                                    alert(
                                                        'Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.'
                                                    );
                                                }
                                            }}
                                        >
                                            {revue.DOI}
                                        </a>
                                    ) : (
                                        'Pas de DOI disponible'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(revue.id)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(revue.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">Aucune revue disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserRevue;
