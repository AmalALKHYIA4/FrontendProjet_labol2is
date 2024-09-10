import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const SeminarList = () => {
    const [seminars, setSeminars] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchSeminars();
    }, [accessToken]);

    const fetchSeminars = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/seminars', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setSeminars(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des séminaires', error);
            setError('Erreur lors de la récupération des séminaires');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce séminaire ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/seminars/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setSeminars(seminars.filter(seminar => seminar.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du séminaire', error);
                setError('Erreur lors de la suppression du séminaire');
            }
        }
    };

    return (
        <div>
            <h1>Gestion des Séminaires</h1>
            <Link to="/dashboard/SeminarForm" className="btn btn-primary mb-4">Ajouter un Séminaire</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure de Début</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure de Fin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intervenant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th> {/* Ajouter la colonne pour le statut */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {seminars.length ? (
                        seminars.map(seminar => (
                            <tr key={seminar.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{seminar.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{seminar.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{seminar.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{seminar.start_time}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{seminar.end_time}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{seminar.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{seminar.speaker}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{seminar.status}</td> {/* Afficher le statut */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/SeminarDetails/${seminar.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(seminar.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center py-4">Aucun séminaire disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SeminarList;
