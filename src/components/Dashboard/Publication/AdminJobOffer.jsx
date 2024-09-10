// src/components/Dashboard/Publication/JobOfferAdmin.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const JobOfferAdmin = () => {
    const [jobOffers, setJobOffers] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchJobOffers();
    }, [accessToken]);

    const fetchJobOffers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/job-offers', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setJobOffers(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des offres d\'emploi', error);
            setError('Erreur lors de la récupération des offres d\'emploi');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre d\'emploi ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/job-offers/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setJobOffers(jobOffers.filter(jobOffer => jobOffer.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'offre d\'emploi', error);
                setError('Erreur lors de la suppression de l\'offre d\'emploi');
            }
        }
    };

    const truncateText = (text, length) => {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    };

    // Fonction pour formater le salaire, avec une vérification du type
    const formatSalary = (salary) => {
        const numSalary = parseFloat(salary);
        return !isNaN(numSalary) ? numSalary.toFixed(2) : 'N/A';
    };

    return (
        <div>
            <h1>Gestion des Offres d'Emploi</h1>
            <Link to="/dashboard/JobOfferCreate" className="btn btn-primary mb-4">Ajouter une Offre</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exigences</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Limite</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {jobOffers.length ? (
                        jobOffers.map(jobOffer => (
                            <tr key={jobOffer.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{truncateText(jobOffer.title, 20)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{truncateText(jobOffer.description, 20)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{truncateText(jobOffer.requirements, 20)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{truncateText(jobOffer.location, 20)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatSalary(jobOffer.salary)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(jobOffer.deadline).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/JobOfferEdit/${jobOffer.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(jobOffer.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4">Aucune offre d'emploi disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default JobOfferAdmin;
