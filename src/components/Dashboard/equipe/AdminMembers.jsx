import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const MembreAdmin = () => {
    const [members, setMembers] = useState([]);
    const [teams, setTeams] = useState([]); // New state for teams
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchMembers();
        fetchTeams(); // Fetch the teams
    }, [accessToken]);

    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/members', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setMembers(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des membres', error);
            setError('Erreur lors de la récupération des membres');
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/equipe', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (Array.isArray(response.data)) {
                setTeams(response.data);
            } else {
                console.error('Les données reçues ne sont pas un tableau');
                setError('Erreur de données');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des équipes', error);
            setError('Erreur lors de la récupération des équipes');
        }
    };

    const getTeamNameById = (id) => {
        const team = teams.find(team => team.id === id);
        return team ? team.name : 'Inconnu';
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/members/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setMembers(members.filter(member => member.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du membre', error);
                setError('Erreur lors de la suppression du membre');
            }
        }
    };

    return (
        <div>
            <h1>Gestion des Membres</h1>
            <Link to="/dashboard/MembreCreate" className="btn btn-primary mb-4">Ajouter un Membre</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th> {/* New column for image */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poste</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Infos de Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Équipe</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {members.length ? (
                        members.map(member => (
                            <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {member.image ? (
                                        <img src={`http://localhost:8000/storage/${member.image}`} alt={member.name} className="w-12 h-12 object-cover rounded-full" />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{member.position}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{member.bio}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{member.contact_info}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{getTeamNameById(member.team_id)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{member.statut}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/MembreEdit/${member.id}`} className="btn btn-primary mb-2">Modifier</Link>
                                    <button onClick={() => handleDelete(member.id)} className="btn btn-danger mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-4">Aucun membre disponible</td> {/* Updated colspan */}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MembreAdmin;
