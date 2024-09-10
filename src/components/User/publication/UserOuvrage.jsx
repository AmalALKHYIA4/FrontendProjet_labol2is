import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserOuvrage = () => {
    const [ouvrages, setOuvrages] = useState([]);
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);

    // Fonction pour récupérer les ouvrages de l'utilisateur
    const fetchOuvrages = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/ouvrages/user-or-contributor/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setOuvrages(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des ouvrages:', error);
            toast.error('Erreur lors de la récupération des ouvrages');
        }
    };

    // Utiliser useEffect pour récupérer les ouvrages lorsque le composant est monté
    useEffect(() => {
        fetchOuvrages();
    }, [currentUser.id, accessToken]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/ouvrages/${id}`);
            toast.success('Ouvrage supprimé avec succès');
            fetchOuvrages(); // Recharger la liste des ouvrages
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'ouvrage:', error);
            toast.error('Erreur lors de la suppression de l\'ouvrage');
        }
    };

    const handleEdit = (id) => {
        navigate(`/user/UserEditOuvrage/${id}`);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Liste des Ouvrages</h1>
            <button
                onClick={() => navigate('/user/UserCreateOuvrage')}
                className="mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Ajouter un Ouvrage
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
                    {ouvrages.length ? (
                        ouvrages.map(ouvrage => (
                            <tr key={ouvrage.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{ouvrage.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{ouvrage.author}</td>
                                <td>
  {ouvrage.DOI ? (
    <a
      href={`https://doi.org/${ouvrage.DOI}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        const isValidDOI = ouvrage.DOI.startsWith('10.');
        if (!isValidDOI) {
          e.preventDefault();
          alert(
            'Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.'
          );
        }
      }}
    >
      {ouvrage.DOI}
    </a>
  ) : (
    'Pas de DOI disponible'
  )}
</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(ouvrage.id)}
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(ouvrage.id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">Aucun ouvrage disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserOuvrage;
