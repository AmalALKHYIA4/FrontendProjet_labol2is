import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserRapport = () => {
    const [rapports, setRapports] = useState([]);
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    // Fonction pour récupérer les rapports de l'utilisateur
    const fetchRapports = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/rapports/user-or-contributor/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setRapports(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des rapports:', error);
            toast.error('Erreur lors de la récupération des rapports');
        }
    };

    // Utiliser useEffect pour récupérer les rapports lorsque le composant est monté
    useEffect(() => {
        fetchRapports();
    }, [currentUser.id, accessToken]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/reports/${id}`);
            toast.success('Rapport supprimé avec succès');
            fetchRapports(); // Recharger la liste des rapports
        } catch (error) {
            console.error('Erreur lors de la suppression du rapport:', error);
            toast.error('Erreur lors de la suppression du rapport');
        }
    };

    const handleEdit = (id) => {
        navigate(`/user/UserEditRapport/${id}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Rapports</h1>
            <button
                onClick={() => navigate('/user/UserCreateRapport')}
                className="mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Ajouter un Rapport
            </button>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résumé</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {rapports.length ? (
                        rapports.map(rapport => (
                            <tr key={rapport.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{rapport.title || 'Titre non disponible'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{rapport.author || 'Auteur non disponible'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{rapport.summary || 'Résumé non disponible'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {rapport.DOI ? (
                                        <a
                                            href={`https://doi.org/${rapport.DOI}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                const isValidDOI = rapport.DOI.startsWith('10.');
                                                if (!isValidDOI) {
                                                    e.preventDefault();
                                                    alert(
                                                        'Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.'
                                                    );
                                                }
                                            }}
                                        >
                                            {rapport.DOI}
                                        </a>
                                    ) : (
                                        'Pas de DOI disponible'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(rapport.id)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rapport.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">Aucun rapport disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserRapport;
