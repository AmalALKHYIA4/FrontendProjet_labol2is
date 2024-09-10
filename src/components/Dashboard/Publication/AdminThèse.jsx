import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const TheseAdmin = () => {
    const [theses, setTheses] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchTheses();
    }, [accessToken]);

    const fetchTheses = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/theses', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setTheses(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des thèses', error);
            setError('Erreur lors de la récupération des thèses');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette thèse ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/theses/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setTheses(theses.filter(these => these.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de la thèse', error);
                setError('Erreur lors de la suppression de la thèse');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Gestion des Thèses</h1>
            <Link to="/dashboard/TheseCreate" className="btn btn-primary mb-4">Ajouter une Thèse</Link>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {['Titre', 'Auteur', 'DOI', 'Lieu', 'Date', 'ID Utilisateur', 'Actions'].map(header => (
                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
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
                                                if (!these.doi.startsWith('10.')) {
                                                    e.preventDefault();
                                                    alert('Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.');
                                                }
                                            }}
                                        >
                                            {these.doi}
                                        </a>
                                    ) : 'Pas de DOI disponible'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{these.lieu}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{these.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{these.id_user}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/TheseEdit/${these.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(these.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4">Aucune thèse disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TheseAdmin;
