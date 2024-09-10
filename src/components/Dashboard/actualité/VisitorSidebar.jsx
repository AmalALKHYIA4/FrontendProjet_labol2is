import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VisitorSidebar.css';
import logo from '../../../assets/labol2is.png';

const VisitorSidebar = () => {
  const [visibility, setVisibility] = useState({
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

  const [isPersonnelSubmenuOpen, setIsPersonnelSubmenuOpen] = useState(visibility.personnel.visible);
  const [isPublicationsSubmenuOpen, setIsPublicationsSubmenuOpen] = useState(visibility.publications.visible);

  useEffect(() => {
    const storedVisibility = localStorage.getItem('sidebarVisibility');
    if (storedVisibility) {
      const parsedVisibility = JSON.parse(storedVisibility);
      setVisibility(parsedVisibility);
      setIsPersonnelSubmenuOpen(parsedVisibility.personnel.visible);
      setIsPublicationsSubmenuOpen(parsedVisibility.publications.visible);
    }
  }, []);

  const toggleSubmenu = (submenu) => {
    if (submenu === 'personnel') {
      setIsPersonnelSubmenuOpen(!isPersonnelSubmenuOpen);
      if (isPublicationsSubmenuOpen) setIsPublicationsSubmenuOpen(false);
    } else if (submenu === 'publications') {
      setIsPublicationsSubmenuOpen(!isPublicationsSubmenuOpen);
      if (isPersonnelSubmenuOpen) setIsPersonnelSubmenuOpen(false);
    }
  };

  return (
    <div className="visitor-sidebar">
      <nav>
        <img src={logo} alt="Laboratory Logo" className="logo" />
        <ul>
          <li><Link to="/">Accueil</Link></li>
          {visibility.organisation && (
            <li><Link to="/organisation">Organisation</Link></li>
          )}
          {visibility.equipes && (
            <li><Link to="/listEquipe">Équipes</Link></li>
          )}
          {visibility.personnel.visible && (
            <li className="no-indent">
              <button 
                onClick={() => toggleSubmenu('personnel')} 
                className={`submenu-toggle ${isPersonnelSubmenuOpen ? 'open' : ''}`}
              >
                Personnel
              </button>
              <ul className={`submenu ${isPersonnelSubmenuOpen ? 'open' : ''}`}>
                {visibility.personnel.membres && <li><Link to="/personnelMember">Membres</Link></li>}
                {visibility.personnel.anciens && <li><Link to="/personnelAncien">Anciens</Link></li>}
              </ul>
            </li>
          )}
          {visibility.publications.visible && (
            <li className="no-indent">
              <button 
                onClick={() => toggleSubmenu('publications')} 
                className={`submenu-toggle ${isPublicationsSubmenuOpen ? 'open' : ''}`}
              >
                Publications
              </button>
              <ul className={`submenu ${isPublicationsSubmenuOpen ? 'open' : ''}`}>
                {visibility.publications.ouvrages && <li><Link to="/ouvrages">Ouvrages</Link></li>}
                {visibility.publications.revues && <li><Link to="/revues">Revues</Link></li>}
                {visibility.publications.conferences && <li><Link to="/conferences">Conférences</Link></li>}
                {visibility.publications.reports && <li><Link to="/reports">Rapports</Link></li>}
                {visibility.publications.thesesDoctorat && <li><Link to="/theses">Thèses et Habilitation</Link></li>}
              </ul>
            </li>
          )}
          {visibility.projets && (
            <li><Link to="/ProjectsPage">Projets</Link></li>
          )}
          {/* {visibility.informations && (
            <li><Link to="/informations">Informations</Link></li>
          )} */}
          {visibility.evenements && (
            <li><Link to="/evenements">Événements</Link></li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default VisitorSidebar;
