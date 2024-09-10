import React, { useState } from 'react';
import './SidebarConfig.css'; // Ensure this file includes styles for your new changes

const SidebarConfig = () => {
  const [visibility, setVisibility] = useState({
    organisation: true, // Added organisation visibility
    equipes: true,
    personnel: {
      visible: true,
      membres: true,
      anciens: true,
    },
    publications: {
      visible: true,
      ouvrages: true,
      revues: true,
      conferences: true,
      reports: true,
      thesesDoctorat: true,
      habilitation: true,
    },
    projets: true,
    informations: true,
    evenements: true,
  });

  const [message, setMessage] = useState('');

  const toggleVisibility = (key) => {
    setVisibility((prevVisibility) => ({ ...prevVisibility, [key]: !prevVisibility[key] }));
  };

  const handleSave = () => {
    localStorage.setItem('sidebarVisibility', JSON.stringify(visibility));
    setMessage('Les paramètres ont été enregistrés avec succès !');
    setTimeout(() => setMessage(''), 3000); // Réinitialiser le message après 3 secondes
  };

  return (
    <div className="sidebar-config-container">
      <h2>Configuration de la sidebar</h2>
      <p>
        Décochez une case pour rendre l'élément invisible.
      </p>
      <ul>
        <li>
          <input
            type="checkbox"
            checked={visibility.organisation}
            onChange={() => toggleVisibility('organisation')}
          />
          <span>Organisation</span>
        </li>
        <li>
          <input
            type="checkbox"
            checked={visibility.equipes}
            onChange={() => toggleVisibility('equipes')}
          />
          <span>Équipes</span>
        </li>
        <li>
          <input
            type="checkbox"
            checked={visibility.personnel.visible}
            onChange={() => toggleVisibility('personnel.visible')}
          />
          <span>Personnel</span>
          <ul>
            <li>
              <input
                type="checkbox"
                checked={visibility.personnel.membres}
                onChange={() => setVisibility((prevVisibility) => ({
                  ...prevVisibility,
                  personnel: { ...prevVisibility.personnel, membres: !prevVisibility.personnel.membres }
                }))}
                disabled={!visibility.personnel.visible} // Désactiver les sous-catégories si la catégorie principale est décochée
              />
              <span>Membres</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={visibility.personnel.anciens}
                onChange={() => setVisibility((prevVisibility) => ({
                  ...prevVisibility,
                  personnel: { ...prevVisibility.personnel, anciens: !prevVisibility.personnel.anciens }
                }))}
                disabled={!visibility.personnel.visible} // Désactiver les sous-catégories si la catégorie principale est décochée
              />
              <span>Anciens</span>
            </li>
          </ul>
        </li>
        <li>
          <input
            type="checkbox"
            checked={visibility.publications.visible}
            onChange={() => toggleVisibility('publications.visible')}
          />
          <span>Publications</span>
          <ul>
            <li>
              <input
                type="checkbox"
                checked={visibility.publications.ouvrages}
                onChange={() => setVisibility((prevVisibility) => ({
                  ...prevVisibility,
                  publications: { ...prevVisibility.publications, ouvrages: !prevVisibility.publications.ouvrages }
                }))}
                disabled={!visibility.publications.visible} // Désactiver les sous-catégories si la catégorie principale est décochée
              />
              <span>Ouvrages</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={visibility.publications.revues}
                onChange={() => setVisibility((prevVisibility) => ({
                  ...prevVisibility,
                  publications: { ...prevVisibility.publications, revues: !prevVisibility.publications.revues }
                }))}
                disabled={!visibility.publications.visible} // Désactiver les sous-catégories si la catégorie principale est décochée
              />
              <span>Revues</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={visibility.publications.conferences}
                onChange={() => setVisibility((prevVisibility) => ({
                  ...prevVisibility,
                  publications: { ...prevVisibility.publications, conferences: !prevVisibility.publications.conferences }
                }))}
                disabled={!visibility.publications.visible} // Désactiver les sous-catégories si la catégorie principale est décochée
              />
              <span>Conférences</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={visibility.publications.reports}
                onChange={() => setVisibility((prevVisibility) => ({
                  ...prevVisibility,
                  publications: { ...prevVisibility.publications, reports: !prevVisibility.publications.reports }
                }))}
                disabled={!visibility.publications.visible} // Désactiver les sous-catégories si la catégorie principale est décochée
              />
              <span>Rapports</span>
            </li>
            <li>
              <input
                type="checkbox"
                checked={visibility.publications.thesesDoctorat}
                onChange={() => setVisibility((prevVisibility) => ({
                  ...prevVisibility,
                  publications: { ...prevVisibility.publications, thesesDoctorat: !prevVisibility.publications.thesesDoctorat }
                }))}
                disabled={!visibility.publications.visible} // Désactiver les sous-catégories si la catégorie principale est décochée
              />
              <span>Thèses et Habilitations</span>
            </li>
          </ul>
        </li>
        <li>
          <input
            type="checkbox"
            checked={visibility.projets}
            onChange={() => toggleVisibility('projets')}
          />
          <span>Projets</span>
        </li>
        <li>
          <input
            type="checkbox"
            checked={visibility.informations}
            onChange={() => toggleVisibility('informations')}
          />
          <span>Informations</span>
        </li>
        <li>
          <input
            type="checkbox"
            checked={visibility.evenements}
            onChange={() => toggleVisibility('evenements')}
          />
          <span>Événements</span>
        </li>
      </ul>
      <button className="save-button" onClick={handleSave}>Enregistrer</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SidebarConfig;