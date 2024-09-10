import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const EquipeAdmin = () => {
    const [equipes, setEquipes] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchEquipes();
    }, [accessToken]);

    const fetchEquipes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/equipe', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setEquipes(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des équipes', error);
            setError('Erreur lors de la récupération des équipes');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/equipe/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setEquipes(equipes.filter(equipe => equipe.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'équipe', error);
                setError('Erreur lors de la suppression de l\'équipe');
            }
        }
    };

    return (
        <div>
            <h1>Gestion des Équipes</h1>
            <Link to="/dashboard/EquipeCreate" className="btn btn-primary mb-4">Ajouter une Équipe</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spécialisation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {equipes.length ? (
                        equipes.map(equipe => (
                            <tr key={equipe.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{equipe.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{equipe.specialization}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{equipe.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/EquipeEdit/${equipe.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(equipe.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">Aucune équipe disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EquipeAdmin;
