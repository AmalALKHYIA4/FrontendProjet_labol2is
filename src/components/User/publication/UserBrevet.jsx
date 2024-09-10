import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';
import { useNavigate } from 'react-router-dom';

const UserBrevet = () => {
    const [brevets, setBrevets] = useState([]);
    const [error, setError] = useState('');
    const { accessToken, currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fonction pour récupérer la liste des brevets
    const fetchBrevets = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/brevets/user-or-contributor/${currentUser.id}`, { 
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setBrevets(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des brevets:', error);
            setError('Erreur lors de la récupération des brevets');
            toast.error('Erreur lors de la récupération des brevets');
        }
    };

    // Fonction pour supprimer un brevet
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/brevets/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            toast.success('Brevet supprimé avec succès');
            fetchBrevets(); // Recharger la liste des brevets
        } catch (error) {
            console.error('Erreur lors de la suppression du brevet:', error);
            toast.error('Erreur lors de la suppression du brevet');
        }
    };

    useEffect(() => {
        fetchBrevets();
    }, [accessToken]);

    const handleEdit = (id) => {
        navigate(`/user/UserEditBrevet/${id}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Brevets</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
                onClick={() => navigate('/user/UserCreateBrevet')}
                className="mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Ajouter un Brevet
            </button>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur(s)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {brevets.length ? (
                        brevets.map(brevet => (
                            <tr key={brevet.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{brevet.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{brevet.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {brevet.doi ? (
                                        <a
                                            href={`https://doi.org/${brevet.doi}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                const isValidDOI = brevet.doi.startsWith('10.');
                                                if (!isValidDOI) {
                                                    e.preventDefault();
                                                    alert(
                                                        'Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.'
                                                    );
                                                }
                                            }}
                                        >
                                            {brevet.doi}
                                        </a>
                                    ) : (
                                        'Pas de DOI disponible'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(brevet.id)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(brevet.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">Aucun brevet trouvé</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserBrevet;
