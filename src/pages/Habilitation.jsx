import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Habilitation.css';
import logoDoctorat from '../assets/doctorat.png'; // Assurez-vous que le chemin est correct

const Habilitation = () => {
  const [habilitations, setHabilitations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabilitations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/habilitations');
        setHabilitations(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des habilitations', error);
        setError(`Erreur lors du chargement des habilitations : ${error.response?.status} - ${error.response?.statusText || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchHabilitations();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="habilitation-container">
      <h1>Habilitations</h1>
      <ul className="habilitation-list">
        {habilitations.map((habilitation) => (
          <li key={habilitation.id} className="habilitation-card">
            <div className="these-header">
              <img
                src={logoDoctorat}
                alt="Chapeau de Doctorat"
                className="these-logo"
              />
            </div>
            <div className="habilitation-content">
              <p className="habilitation-info"><strong>Titre:</strong> {habilitation.title}</p>
              <p className="habilitation-info"><strong>Auteur:</strong> {habilitation.author}</p>
              <p className="habilitation-info"><strong>Date:</strong> {new Date(habilitation.date).toLocaleDateString()}</p>
              <p className="habilitation-info"><strong>Lieu:</strong> {habilitation.lieu || 'Non spécifié'}</p>
              {habilitation.DOI && (
                <p className="habilitation-info">
                  <strong>DOI:</strong> 
                  <a href={`https://doi.org/${habilitation.DOI}`} target="_blank" rel="noopener noreferrer">
                    {habilitation.DOI}
                  </a>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Habilitation;
