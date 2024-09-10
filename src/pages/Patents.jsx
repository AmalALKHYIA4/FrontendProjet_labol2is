import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Patents.css'; // Importer le fichier CSS

const Patents = () => {
    const [patents, setPatents] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/patents')
            .then(response => {
                console.log('Données récupérées:', response.data); // Pour vérifier les données
                setPatents(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des brevets', error);
                setError('Erreur lors de la récupération des brevets');
            });
    }, []);

    return (
        <div className="patents-page">
            <h1>Brevets</h1>
            {error && <p className="error">{error}</p>}

            <div className="patents-container">
                {patents.length > 0 ? (
                    patents.map(patent => (
                        <div className="patent-card" key={patent.id}>
                            <h3>{patent.title || 'Titre non disponible'}</h3>
                            <p><strong>Description:</strong> {patent.description || 'Description non disponible'}</p>
                            <p><strong>Date de Dépôt:</strong> {patent.filing_date ? new Date(patent.filing_date).toLocaleDateString() : 'Date non disponible'}</p>
                            {patent.pdf_link ? (
                                <a href={patent.pdf_link} target="_blank" rel="noopener noreferrer" className="pdf-link">
                                    Télécharger le PDF
                                </a>
                            ) : (
                                <p className="no-pdf">PDF non disponible</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Aucun brevet disponible.</p>
                )}
            </div>
        </div>
    );
};

export default Patents;
