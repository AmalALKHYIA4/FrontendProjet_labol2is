// components/Home.js


import React, { useState, useEffect } from 'react';
import logo from '../assets/labol2is.png'; // Assurez-vous que le chemin du logo est correct
import arrowGif from '../assets/fleche.gif'; // Assurez-vous que le chemin de la flèche est correct
import HomeNews from './HomeNews';
import parse from 'html-react-parser';
//import TeamsPage    from '../pages/Equipes';
import JobOffersList from '..//pages/JobOffersList';
import axios from 'axios';
import Statistics from '../pages/Statistics';


const Home = ({ currentUser, logoutUser, isSidebarVisible, toggleSidebar }) => {
    const [descriptions, setDescriptions] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchDescriptions = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/home-descriptions');
                if (Array.isArray(response.data)) {
                    setDescriptions(response.data);
                } else {
                    throw new Error('Les données reçues ne sont pas un tableau');
                }
            } catch (error) {
                const errorMessage = error.response 
                    ? (error.response.data.message || 'Erreur inconnue du serveur') + ' - Code: ' + error.response.status
                    : error.message || 'Erreur inconnue';
                console.error('Erreur lors de la récupération des descriptions', errorMessage);
                setError('Erreur lors de la récupération des descriptions : ' + errorMessage);
            }
        };
    
        fetchDescriptions();
    }, []);
    

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Section Logo */}
      <div className="flex items-center mb-4">
        <img
          src={logo}
          alt="Laboratory Logo"
          style={{ height: '140px', width: 'auto' }} // Ajuste la hauteur à 140px avec largeur automatique
        />
      </div>

      {/* Titre */}
      <h1
        style={{ fontSize: '3rem', marginTop: '2rem', marginBottom: '2rem', color: '#1A237E' }}
        className="font-bold text-center"
      >
        L2IS - Laboratoire d'Ingénierie Informatique et Systèmes
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
            {descriptions.length ? (
                descriptions.map((desc) => (
                    <div key={desc.id} className="max-w-4xl text-center mb-8">
                        <div className="prose lg:prose-xl">
                            {parse(desc.content)}
                        </div>
                    </div>
                ))
            ) : (
                <p>Aucune description disponible</p>
)}
      
      {/* Flèche animée */}
      <div className="flex flex-col items-center">
        <h2 style={{ color: '#1A237E', fontSize: '2rem', marginTop: '2rem' }}>Actualités</h2>
        <img
          src={arrowGif}
          alt="Flèche animée"
          style={{ height: '60px', width: 'auto' }} // Ajustez la taille selon vos besoins
        />
      </div>

      {/* Liste des actualités */}
      <HomeNews />
      <div className="flex flex-col items-center">
        <h2 style={{ color: '#1A237E', fontSize: '2rem', marginTop: '2rem' }}>Offres d'Emploi</h2>
        <img
          src={arrowGif}
          alt="Flèche animée"
          style={{ height: '60px', width: 'auto' }} // Ajustez la taille selon vos besoins
        />
      </div>
      <JobOffersList />
      {/* <TeamsPage /> */}
      <Statistics />

    </div>
  );
};

export default Home;
