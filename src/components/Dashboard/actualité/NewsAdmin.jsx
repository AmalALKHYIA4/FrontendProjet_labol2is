import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { toast } from 'react-toastify';

const NewsAdmin = () => {
    const [news, setNews] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/news', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setNews(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des actualités:', err.response ? err.response.data : err.message);
                setError('Erreur lors de la récupération des actualités. Veuillez réessayer.');
                toast.error('Erreur lors de la récupération des actualités.');
            }
        };

        fetchNews();
    }, [accessToken]);

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/news/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setNews(news.filter((item) => item.id !== id));
                toast.success('Actualité supprimée avec succès.');
            } catch (err) {
                console.error('Erreur lors de la suppression de l\'actualité:', err.response ? err.response.data : err.message);
                toast.error('Erreur lors de la suppression de l\'actualité.');
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
     <Link to="/dashboard/NewsCreate" className="btn btn-primary mb-4">Ajouter une Actualité</Link>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Titre</th>
                        <th className="border px-4 py-2">Image</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {news.length > 0 ? (
                        news.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">{item.id}</td>
                                <td className="border px-4 py-2">{item.title}</td>
                                <td className="border px-4 py-2">
                                    {item.image ? (
                                        <img
                                            src={`http://localhost:8000/storage/${item.image}`}
                                            alt={item.title}
                                            style={{ width: '100px', height: 'auto' }}
                                        />
                                    ) : 'Pas d\'image'}
                                </td>
                                <td className="border px-4 py-2">
                                <Link to={`/dashboard/NewsEdit/${item.id}`} className="btn btn-primary mb-2">Modifier</Link>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-primary mb-2">Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="border px-4 py-2 text-center">Aucune actualité disponible.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default NewsAdmin;
