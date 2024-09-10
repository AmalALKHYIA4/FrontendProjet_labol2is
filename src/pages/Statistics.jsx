import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './statistics.css'; // Assurez-vous que le chemin est correct

const Statistics = () => {
  const [statistics, setStatistics] = useState({
    revues: 0,
    ouvrages: 0,
    projets: 0,
    rapports: 0,
    brevets: 0,
    conferences: 0,
    seminaires: 0,
    members: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/statistics');
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-xl font-bold">Revues</h3>
          <p className="text-3xl">{statistics.revues}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-xl font-bold">Ouvrages</h3>
          <p className="text-3xl">{statistics.ouvrages}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-xl font-bold">Projets</h3>
          <p className="text-3xl">{statistics.projets}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-xl font-bold">Rapports</h3>
          <p className="text-3xl">{statistics.rapports}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-xl font-bold">Brevets</h3>
          <p className="text-3xl">{statistics.brevets}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-xl font-bold">Conférences</h3>
          <p className="text-3xl">{statistics.conferences}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-xl font-bold">Séminaires</h3>
          <p className="text-3xl">{statistics.seminaires}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-xl font-bold">Membres</h3>
          <p className="text-3xl">{statistics.members}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;