import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const ReportEdit = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [doi, setDoi] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { accessToken } = useContext(AuthContext);
    const { id } = useParams();

    useEffect(() => {
        fetchMembers();
        fetchReportDetails();
    }, [accessToken, id]);

    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/members', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setMembers(response.data);
        } catch (error) {
            handleError('Erreur lors de la récupération des membres', error);
        }
    };

    const fetchReportDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/reports/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const report = response.data;
            setTitle(report.title);
            setSummary(report.summary);
            setDoi(report.DOI);
            setSelectedAuthors(report.author.split(', '));
            setSelectedAuthorIds(report.id_user.split(','));
        } catch (error) {
            handleError('Erreur lors de la récupération du rapport', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedAuthorIds.length === 0) {
            showError('Veuillez sélectionner au moins un auteur.');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/reports/${id}`, {
                title,
                author: selectedAuthors.join(', '),
                summary,
                DOI: doi,
                id_user: selectedAuthorIds.join(','),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            toast.success('Rapport mis à jour avec succès');
            navigate('/dashboard/report');
        } catch (error) {
            handleError('Erreur lors de la mise à jour du rapport', error);
        }
    };

    const handleAuthorSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const names = selectedOptions.map(option => option.textContent);
        const ids = selectedOptions.map(option => option.getAttribute('data-id'));

        setSelectedAuthors(names);
        setSelectedAuthorIds(ids);
    };

    const handleError = (message, error) => {
        console.error(`${message}:`, error);
        setError(message);
        toast.error(message);
    };

    const showError = (message) => {
        setError(message);
        toast.error(message);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier un Rapport</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            {selectedAuthors.length > 0 && (
                <div className="mb-4">
                    <strong>Auteurs sélectionnés :</strong> {selectedAuthors.join(', ')}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Auteur(s)</label>
                    <select
                        multiple
                        value={selectedAuthors}
                        onChange={handleAuthorSelection}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        {members.map(member => (
                            <option key={member.id} value={member.name} data-id={member.user_id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                        Pour sélectionner plusieurs auteurs, maintenez la touche <strong>Ctrl</strong> (ou <strong>Cmd</strong> sur Mac) enfoncée tout en cliquant sur les noms souhaités.
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Résumé</label>
                    <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">DOI</label>
                    <input
                        type="text"
                        value={doi}
                        onChange={(e) => setDoi(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Mettre à jour
                </button>
            </form>
        </div>
    );
};

export default ReportEdit;
