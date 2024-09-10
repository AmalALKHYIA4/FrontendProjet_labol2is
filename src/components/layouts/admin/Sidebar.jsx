import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { BASE_URL, getConfig } from '../../../helpers/config';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Sidebar.css';
import logo from '../../../assets/labol2is.png';

const Sidebar = () => {
  const { accessToken, setAccessToken, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEquipesSubmenuOpen, setIsEquipesSubmenuOpen] = useState(false);
  const [isPublicationsSubmenuOpen, setIsPublicationsSubmenuOpen] = useState(false);

  const toggleEquipesSubmenu = () => {
    setIsEquipesSubmenuOpen(!isEquipesSubmenuOpen);
    if (isPublicationsSubmenuOpen) setIsPublicationsSubmenuOpen(false);
  };

  const togglePublicationsSubmenu = () => {
    setIsPublicationsSubmenuOpen(!isPublicationsSubmenuOpen);
    if (isEquipesSubmenuOpen) setIsEquipesSubmenuOpen(false);
  };

  const logoutUser = async () => {
    try {
      await axios.post(`${BASE_URL}/user/logout`, null, getConfig(accessToken));
      localStorage.removeItem('currentToken');
      setAccessToken('');
      setCurrentUser(null);
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      if (error?.response?.status === 401) {
        localStorage.removeItem('currentToken');
        setAccessToken('');
        setCurrentUser(null);
        toast.error('Déconnexion échouée');
        navigate('/');
      }
      console.log(error);
    }
  };

  return (
    <div className="flex flex-1 pt-20">
      <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
        <div className="sidebar-logo">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Laboratory Logo" />
          </Link>
        </div>
        <div className="sb-sidenav-menu">
          <div className="nav">
          <Link className="nav-link" to="/dashboard/SidebarConfig">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Sidebar
            </Link>
            <Link className="nav-link" to="/dashboard/AdminHomeDescription">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Home
            </Link>
            <Link className="nav-link" to="/dashboard/Utilisateur">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Utilisateurs
            </Link>
            <Link className="nav-link" to="/dashboard/NewsAdmin">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Actualités
            </Link>
            {/* <Link className="nav-link" to="/dashboard/Organisation">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Organisation
            </Link> */}
            <Link className="nav-link" to="/dashboard/Member">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Members
            </Link>

            {/* Équipes */}
            <div className="nav-link section-title" onClick={toggleEquipesSubmenu}>
              <div className="sb-nav-link-icon"><i className="fas fa-user-friends"></i></div>
              Équipes
            </div>
            <ul className={`submenu ${isEquipesSubmenuOpen ? 'open' : ''}`}>
              <li><Link to="/dashboard/equipe">Équipe</Link></li>
              <li><Link to="/dashboard/PresentationAdmin">Présentation</Link></li>
              <li><Link to="/dashboard/axe">Axes de Recherche</Link></li>
              <li><Link to="/dashboard/publication">Publications</Link></li>
            </ul>

            {/* Publications */}
            <div className="nav-link section-title" onClick={togglePublicationsSubmenu}>
              <div className="sb-nav-link-icon"><i className="fas fa-book"></i></div>
              Publications
            </div>
            <ul className={`submenu ${isPublicationsSubmenuOpen ? 'open' : ''}`}>
              <li><Link to="/dashboard/ouvrage">Ouvrages</Link></li>
              <li><Link to="/dashboard/JobOffer">offres d'emploi</Link></li>
              <li><Link to="/dashboard/revues">Revues</Link></li>
              <li><Link to="/dashboard/conference">Conférences</Link></li>
              <li><Link to="/dashboard/report">Rapports</Link></li>
              <li><Link to="/dashboard/patent">Brevets</Link></li>
             
              <li><Link to="/dashboard/theses">Thèses et Doctorat</Link></li>

              <li><Link to="/dashboard/habilitation">Habilitation</Link></li>
            </ul>

            <Link className="nav-link" to="/dashboard/ProjectsAdmin">
              <div className="sb-nav-link-icon"><i className="fas fa-project-diagram"></i></div>
              Projets Industriels
            </Link>
            <Link className="nav-link" to="/dashboard/informa">
              <div className="sb-nav-link-icon"><i className="fas fa-info-circle"></i></div>
              Informations
            </Link>
            <Link className="nav-link" to="/dashboard/SeminarList">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Séminaires
            </Link>
            <button className="nav-link" onClick={logoutUser}>
              <div className="sb-nav-link-icon"><i className="fas fa-sign-out-alt"></i></div>
              Déconnexion
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
