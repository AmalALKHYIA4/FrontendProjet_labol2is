import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const ReportCreate = () => {
  const [report, setReport] = useState({
    title: '',
    author: '',
    summary: '',
    pdf_link: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/reports', report, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      console.log('Rapport créé:', response.data);
      toast.success('Rapport créé avec succès');
      navigate('/dashboard/report'); // Rediriger vers la liste des rapports après création
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        console.error('Erreurs de validation:', validationErrors);
        setError('Erreur de validation : ' + Object.values(validationErrors).flat().join(', '));
      } else {
        console.error('Erreur lors de la création du rapport', error);
        setError('Erreur lors de la création du rapport');
      }
      toast.error('Erreur lors de la création du rapport');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReport({
      ...report,
      [name]: value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ajouter un Rapport</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Titre</label>
          <input
            type="text"
            name="title"
            value={report.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Auteur</label>
          <input
            type="text"
            name="author"
            value={report.author}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Résumé</label>
          <textarea
            name="summary"
            value={report.summary}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lien PDF</label>
          <input
            type="url"
            name="pdf_link"
            value={report.pdf_link}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Créer
        </button>
      </form>
    </div>
  );
};

export default ReportCreate;
