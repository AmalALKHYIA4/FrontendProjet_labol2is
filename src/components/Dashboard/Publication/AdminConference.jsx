import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const ConferenceAdmin = () => {
    const [conferences, setConferences] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchConferences();
    }, [accessToken]);

    const fetchConferences = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/conferences', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setConferences(response.data);
            } else {
                setError('Erreur de données');
            }
        } catch (error) {
            setError('Erreur lors de la récupération des conférences');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette conférence ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/conferences/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setConferences(conferences.filter(conference => conference.id !== id));
            } catch (error) {
                setError('Erreur lors de la suppression de la conférence');
            }
        }
    };

    return (
        <div>
            <h1>Gestion des Conférences</h1>
            <Link to="/dashboard/ConferenceCreate" className="btn btn-primary mb-4">Ajouter une Conférence</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom de la Conférence</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteurs</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre du Papier</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {conferences.length ? (
                        conferences.map(conference => (
                            <tr key={conference.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {conference.image && (
                                        <img
                                            src={`http://localhost:8000/storage/${conference.image}`}
                                            alt={conference.title}
                                            className="w-20 h-20 object-cover"
                                        />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{conference.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{conference.conference_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{conference.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{conference.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{conference.authors}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{conference.paper_title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{conference.reference}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/ConferenceEdit/${conference.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(conference.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center py-4">Aucune conférence disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ConferenceAdmin;
