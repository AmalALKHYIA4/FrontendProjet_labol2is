import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const OuvrageAdmin = () => {
    const [ouvrages, setOuvrages] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchOuvrages();
    }, [accessToken]);

    const fetchOuvrages = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/ouvrages', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setOuvrages(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des ouvrages', error);
            setError('Erreur lors de la récupération des ouvrages');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet ouvrage ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/ouvrages/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setOuvrages(ouvrages.filter(ouvrage => ouvrage.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'ouvrage', error);
                setError('Erreur lors de la suppression de l\'ouvrage');
            }
        }
    };

    return (
        <div>
            <h1>Gestion des Ouvrages</h1>
            <Link to="/dashboard/OuvrageCreate" className="btn btn-primary mb-4">Ajouter un Ouvrage</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOI</th> {/* Nouvelle colonne pour le lien PDF */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Utilisateur</th> {/* Nouvelle colonne pour id_user */}
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
                                <td className="px-6 py-4 whitespace-nowrap">{ouvrage.id_user}</td> {/* Affichage de l'id_user */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/OuvrageEdit/${ouvrage.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(ouvrage.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">Aucun ouvrage disponible</td> {/* Mise à jour du colspan pour inclure la nouvelle colonne */}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OuvrageAdmin;
