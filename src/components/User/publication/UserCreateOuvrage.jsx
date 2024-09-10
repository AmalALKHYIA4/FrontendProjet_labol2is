import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserCreateOuvrage = () => {
    const [title, setTitle] = useState('');
    const [DOI, setDOI] = useState('');
    const [members, setMembers] = useState([]); // Liste des membres
    const [selectedAuthors, setSelectedAuthors] = useState([]); // Auteurs sélectionnés
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]); // IDs des membres sélectionnés
    const [optionalAuthors, setOptionalAuthors] = useState(['']); // Auteurs facultatifs, initialement un champ vide
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser, accessToken } = useContext(AuthContext);
    const cleanSelectedAuthorIds = (ids) => {
        return ids.filter(id => id !== null && id !== undefined && id !== "");
    };
    
    // Fonction pour récupérer les informations des membres
    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/members', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setMembers(response.data.filter(member => member.name !== currentUser.name)); // Exclure le currentUser
        } catch (error) {
            console.error('Erreur lors de la récupération des membres:', error);
            setError('Erreur lors de la récupération des membres');
            toast.error('Erreur lors de la récupération des membres');
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [accessToken]);

    useEffect(() => {
        // Ajouter le currentUser comme auteur par défaut
        setSelectedAuthors([currentUser.name]);
        setSelectedAuthorIds([currentUser.id]); // Ajouter l'ID de l'utilisateur courant
    }, [currentUser]);

    // Fonction pour mettre à jour la liste des membres avec les auteurs facultatifs
    const updateMembersWithOptionalAuthors = () => {
        // Créer un tableau avec les membres existants et les auteurs facultatifs
        const updatedMembers = [
            ...members,
            ...optionalAuthors
                .filter(author => author.trim() !== '') // Filtrer les auteurs facultatifs vides
                .map((author, index) => ({
                    id: `optional_${index}`,
                    name: author
                    //user_id: `optional_${index}` // ID fictif pour les auteurs facultatifs
                }))
        ];
        return updatedMembers;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérifier que l'utilisateur a sélectionné des auteurs
        if (selectedAuthorIds.length === 0) {
            setError('Veuillez sélectionner au moins un auteur.');
            toast.error('Veuillez sélectionner au moins un auteur.');
            return;
        }
       
      

        try {
            const response = await axios.post('http://localhost:8000/api/ouvrages', {
                title,
                author: selectedAuthors.join(', '), // Ajouter les auteurs sélectionnés
                DOI,
                id_user: [...cleanSelectedAuthorIds(selectedAuthorIds)].join(','),  // Convertir le tableau en chaîne
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            console.log('Ouvrage ajouté:', response.data);
            toast.success('Ouvrage ajouté avec succès');
            navigate('/user/UserOuvrage');
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'ouvrage:', {
                message: error.message,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                } : 'Aucune réponse disponible',
                config: error.config
            });
            setError('Erreur lors de l\'ajout de l\'ouvrage');
            toast.error('Erreur lors de l\'ajout de l\'ouvrage');
        }
    };

    const handleAuthorSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const names = selectedOptions.map(option => option.value);
        const ids = selectedOptions.map(option => option.getAttribute('data-id'));

        setSelectedAuthors([currentUser.name, ...names]); // Ajouter le currentUser avec les autres auteurs sélectionnés
        
        setSelectedAuthorIds([currentUser.id, ...cleanSelectedAuthorIds(ids)]); // Ajouter l'ID de l'utilisateur courant avec les IDs des autres membres sélectionnés
        console.log(ids)
       
        
    };

    const handleAddOptionalAuthor = () => {
        setOptionalAuthors([...optionalAuthors, '']); // Ajouter un nouveau champ pour l'auteur facultatif
    };

    const handleOptionalAuthorChange = (index, value) => {
        const newOptionalAuthors = [...optionalAuthors];
        newOptionalAuthors[index] = value;
        setOptionalAuthors(newOptionalAuthors);
    };

    const handleRemoveOptionalAuthor = (index) => {
        // Supprimer l'auteur facultatif à l'index spécifié
        const newOptionalAuthors = optionalAuthors.filter((_, i) => i !== index);
        setOptionalAuthors(newOptionalAuthors);
    };

  

    const membersWithOptionalAuthors = updateMembersWithOptionalAuthors();

    // Conditionner l'affichage du bouton "Ajouter les auteurs facultatifs"
    const shouldShowAddButton = optionalAuthors.length === 1 && optionalAuthors[0] === '';
    // Appliquer la fonction de nettoyage
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ajouter un Ouvrage</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            {/* Afficher les IDs et les noms des membres sélectionnés */}
            {selectedAuthorIds.length > 0 && (
                <div className="mb-4">
                    <div className="mb-2">
                        <strong>IDs des auteurs sélectionnés :</strong>
                        <div>{
                        selectedAuthorIds.join(', ')}</div>
                    </div>
                    <div>
                        <strong>Noms des auteurs sélectionnés :</strong>
                        <div>{selectedAuthors.join(', ')}</div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Titre</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Auteur(s)</label>
                    <select
                        multiple
                        value={selectedAuthors}
                        onChange={handleAuthorSelection}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        {membersWithOptionalAuthors.map(member => (
                            <option key={member.id} value={member.name} data-id={member.user_id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                        Pour sélectionner plusieurs auteurs, maintenez la touche <strong>Ctrl</strong> (ou <strong>Cmd</strong> sur Mac) enfoncée tout en cliquant sur les noms souhaités.
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Auteur(s) Facultatif(s)</label>
                    <div className="space-y-2">
                        {optionalAuthors.map((author, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => handleOptionalAuthorChange(index, e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOptionalAuthor(index)}
                                    className="ml-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                >
                                    &minus;
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={handleAddOptionalAuthor}
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Ajouter Autre Auteur(s) Facultatif(s)
                        </button>
                       
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">DOI</label>
                    <input
                        type="text"
                        value={DOI}
                        onChange={(e) => setDOI(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Ajouter
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserCreateOuvrage;
