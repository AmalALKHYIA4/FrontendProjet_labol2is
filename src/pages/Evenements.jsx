import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Seminar from './Seminar'; // Assurez-vous que le chemin est correct
import Conference from './Conference'; // Assurez-vous que le chemin est correct

const Evenements = () => {
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUpcomingProjects();
  }, []);

  const fetchUpcomingProjects = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/projects/ongoing');
      setUpcomingProjects(response.data);
    } catch (err) {
      console.error('Error fetching upcoming projects:', err);
      setError('Erreur lors de la récupération des projets à venir');
    }
  };

  // Style object for the project container with decreased size
  const projectContainerStyle = {
    maxWidth: '900px', // Decreased by 23px from 300px (300px - 23px)
    padding: '15px', // Maintain padding
    margin: '10px auto', // Center the container with space around it
    border: '1px  #ccc', // Border for visibility
    borderRadius: '5px', // Slightly round the corners
    boxShadow: '0 4px 5px rgba(0, 0, 0, 0.1)', // Subtle shadow
  };

  // Style object for the title
  const titleStyle = {
    marginLeft: '140px', // Move the title 25px to the right
    textDecoration: 'underline', // Add underline
    textDecorationColor: '#B0E0E6', // Set underline color
  };

  return (
    <div>
      <Seminar />
      <Conference />

      <h2 style={titleStyle}>Projets à venir</h2>
      <div className="projects upcoming">
        {error && <p className="error">{error}</p>}
        {upcomingProjects.length > 0 ? (
          upcomingProjects.map(project => (
            <div className="project-card" key={project.id} style={projectContainerStyle}>
              <h3>{project.title || 'Titre non disponible'}</h3>
              <p><strong>Description:</strong> {project.description || 'Description non disponible'}</p>
              <p><strong>Équipe:</strong> {project.team || 'Équipe non disponible'}</p>
              <p><strong>Date de début:</strong> {new Date(project.start_date).toLocaleDateString() || 'Date non disponible'}</p>
              <p><strong>Date de fin:</strong> {new Date(project.end_date).toLocaleDateString() || 'Date non disponible'}</p>
              <p><strong>Type de financement:</strong> {project.funding_type || 'Type non disponible'}</p>
            </div>
          ))
        ) : (
          <p>Aucun projet à venir.</p>
        )}
      </div>
    </div>
  );
};

export default Evenements;
