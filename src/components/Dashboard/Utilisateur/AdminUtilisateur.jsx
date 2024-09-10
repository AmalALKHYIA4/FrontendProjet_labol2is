import React, { useState, useEffect, useContext } from 'react'; // Ajout de useContext ici
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext'; // Assurez-vous que le chemin est correct
import { toast } from 'react-toastify';

const AdminUtilisateur = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { accessToken } = useContext(AuthContext); // Utilisation de useContext ici

  useEffect(() => {
    fetchUsers();
  }, [accessToken]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Les données reçues ne sont pas un tableau');
        setError('Erreur de données');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
      setError('Erreur lors de la récupération des utilisateurs');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur', error);
        setError('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  return (
    <div>
      <h1>Gestion des Utilisateurs</h1>
      <Link to="/dashboard/UserCreate" className="btn btn-primary mb-4">Ajouter un Utilisateur</Link>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length ? (
            users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role === 1 ? 'Admin' : 'Utilisateur'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/dashboard/UserEdit/${user.id}`} className="btn btn-primary mb-2">Modifier</Link>
                  <button onClick={() => handleDelete(user.id)} className="btn btn-danger mb-2">Supprimer</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">Aucun utilisateur disponible</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUtilisateur;
