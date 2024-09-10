import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const RevueAdmin = () => {
    const [revues, setRevues] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchRevues();
    }, [accessToken]);

    const fetchRevues = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/revues', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setRevues(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des revues', error);
            setError('Erreur lors de la récupération des revues');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette revue ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/revues/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setRevues(revues.filter(revue => revue.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de la revue', error);
                setError('Erreur lors de la suppression de la revue');
            }
        }
    };

    return (
        <div>
            <h1>Gestion des Revues</h1>
            <Link to="/dashboard/RevueCreate" className="btn btn-primary mb-4">Ajouter une Revue</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Utilisateur</th>
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
                                                    alert('Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.');
                                                }
                                            }}
                                        >
                                            {revue.DOI}
                                        </a>
                                    ) : (
                                        'Pas de DOI disponible'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{revue.id_user}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/RevuesEdit/${revue.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(revue.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">Aucune revue disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RevueAdmin;
