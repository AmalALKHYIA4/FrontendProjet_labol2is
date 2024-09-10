import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const BrevetAdmin = () => {
    const [brevets, setBrevets] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchBrevets = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/brevets', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (Array.isArray(response.data)) {
                    setBrevets(response.data);
                } else {
                    console.error('Les données reçues ne sont pas un tableau');
                    setError('Erreur de données');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des brevets:', error);
                setError('Erreur lors de la récupération des brevets');
            }
        };

        fetchBrevets();
    }, [accessToken]);

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce brevet ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/brevets/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setBrevets(brevets.filter(brevet => brevet.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du brevet:', error);
                setError('Erreur lors de la suppression du brevet');
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gestion des Brevets</h1>
            <Link to="/dashboard/BrevetCreate" className="btn btn-primary mb-4">Ajouter un Brevet</Link>
            {error && <p className="text-red-500 mb-4">{error}</p>}
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
                                                    alert('Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.');
                                                }
                                            }}
                                        >
                                            {brevet.doi}
                                        </a>
                                    ) : (
                                        'Pas de DOI disponible'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{brevet.id_user}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/BrevetEdit/${brevet.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(brevet.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-4">Aucun brevet disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BrevetAdmin;
