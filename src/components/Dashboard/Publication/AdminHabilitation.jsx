import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const AdminHabilitation = () => {
    const [habilitations, setHabilitations] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchHabilitations();
    }, [accessToken]);

    const fetchHabilitations = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/habilitations', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setHabilitations(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des habilitations', error);
            setError('Erreur lors de la récupération des habilitations');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette habilitation ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/habilitations/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setHabilitations(habilitations.filter(habilitation => habilitation.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'habilitation', error);
                setError('Erreur lors de la suppression de l\'habilitation');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestion des Habilitations</h1>
            <Link to="/dashboard/HabilitationCreate" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">Ajouter une Habilitation</Link>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Utilisateur</th>
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
                                <td className="px-6 py-4 whitespace-nowrap">{habilitation.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{habilitation.id_user}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/HabilitationEdit/${habilitation.id}`} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 inline-block">Modifier</Link>
                                    <button onClick={() => handleDelete(habilitation.id)} className="bg-red-500 text-white px-4 py-2 rounded inline-block">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4">Aucune habilitation disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminHabilitation;
