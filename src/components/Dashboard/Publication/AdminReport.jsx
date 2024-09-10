import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const ReportAdmin = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchReports();
    }, [accessToken]);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/reports', {
                headers: {
                    'Authorization': `Bearer ${accessToken}` // Fixed string interpolation
                }
            });

            if (Array.isArray(response.data)) {
                setReports(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des rapports', error);
            setError('Erreur lors de la récupération des rapports');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/reports/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}` // Fixed string interpolation
                    }
                });
                setReports(reports.filter(report => report.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du rapport', error);
                setError('Erreur lors de la suppression du rapport');
            }
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Gestion des Rapports</h1>
            <Link to="/dashboard/ReportCreate" className="btn btn-primary mb-4">Ajouter un Rapport</Link>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auteur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résumé</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Utilisateur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {reports.length > 0 ? (
                        reports.map(report => (
                            <tr key={report.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{report.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{report.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{report.summary}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {report.DOI ? (
                                        <a
                                            href={`https://doi.org/${report.DOI}`} // Fixed URL interpolation
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                const isValidDOI = report.DOI.startsWith('10.');
                                                if (!isValidDOI) {
                                                    e.preventDefault();
                                                    alert(
                                                        'Le DOI fourni semble invalide ou non trouvé. Vous pouvez essayer le lien PDF si disponible.'
                                                    );
                                                }
                                            }}
                                        >
                                            {report.DOI}
                                        </a>
                                    ) : (
                                        'Pas de DOI disponible'
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{report.id_user}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/ReportEdit/${report.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(report.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4">Aucun rapport disponible</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ReportAdmin;
