import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../context/authContext';

const UserEditOuvrage = () => {
    const [title, setTitle] = useState('');
    const [DOI, setDOI] = useState('');
    const [members, setMembers] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);
    const [optionalAuthors, setOptionalAuthors] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();  // Get the ouvrage ID from the URL params
    const { currentUser, accessToken } = useContext(AuthContext);

    const cleanSelectedAuthorIds = (ids) => ids.filter(id => id !== null && id !== undefined && id !== "");

    // Fetch the list of members
    const fetchMembers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/members', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            setMembers(response.data.filter(member => member.name !== currentUser.name));
        } catch (error) {
            console.error('Erreur lors de la récupération des membres:', error);
            setError('Erreur lors de la récupération des membres');
            toast.error('Erreur lors de la récupération des membres');
        }
    };

    // Fetch ouvrage details to edit
    const fetchOuvrageDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/ouvragesUsers/${id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const { title, DOI, author, id_user } = response.data;
            const authors = author.split(', ');
            const authorIds = id_user.split(',');

            // Set state for fetched data
            setTitle(title);
            setDOI(DOI);

            // Separate selected and optional authors
            const selected = [];
            const selectedIds = [];
            const optional = [];

            authors.forEach((author, index) => {
                if (authorIds[index]) {
                    selected.push(author);
                    selectedIds.push(authorIds[index]);
                } else {
                    optional.push(author);
                }
            });

            setSelectedAuthors([currentUser.name, ...selected]);
            setSelectedAuthorIds([currentUser.id, ...cleanSelectedAuthorIds(selectedIds)]);
            setOptionalAuthors(optional);

        } catch (error) {
            console.error('Erreur lors de la récupération de l\'ouvrage:', error);
            setError('Erreur lors de la récupération de l\'ouvrage');
            toast.error('Erreur lors de la récupération de l\'ouvrage');
        }
    };

    useEffect(() => {
        fetchMembers();
        fetchOuvrageDetails();
    }, [accessToken, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedAuthorIds.length === 0) {
            setError('Veuillez sélectionner au moins un auteur.');
            toast.error('Veuillez sélectionner au moins un auteur.');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/ouvrages/${id}`, {
                title,
                author: selectedAuthors.join(', '),
                DOI,
                id_user: [...cleanSelectedAuthorIds(selectedAuthorIds)].join(','),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            toast.success('Ouvrage mis à jour avec succès');
            navigate('/user/UserOuvrage');
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'ouvrage:', error);
            setError('Erreur lors de la mise à jour de l\'ouvrage');
            toast.error('Erreur lors de la mise à jour de l\'ouvrage');
        }
    };

    const handleAuthorSelection = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions);
        const names = selectedOptions.map(option => option.value);
        const ids = selectedOptions.map(option => option.getAttribute('data-id'));

        setSelectedAuthors([currentUser.name, ...names]);
        setSelectedAuthorIds([currentUser.id, ...cleanSelectedAuthorIds(ids)]);
    };

    const handleAddOptionalAuthor = () => {
        setOptionalAuthors([...optionalAuthors, '']);
    };

    const handleOptionalAuthorChange = (index, value) => {
        const newOptionalAuthors = [...optionalAuthors];
        newOptionalAuthors[index] = value;
        setOptionalAuthors(newOptionalAuthors);
    };

    const handleRemoveOptionalAuthor = (index) => {
        const newOptionalAuthors = optionalAuthors.filter((_, i) => i !== index);
        setOptionalAuthors(newOptionalAuthors);
    };

    const membersWithOptionalAuthors = [
        ...members,
        ...optionalAuthors
            .filter(author => author.trim() !== '')
            .map((author, index) => ({
                id: `optional_${index}`,
                name: author,
            }))
    ];

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Modifier l'Ouvrage</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}


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
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                        Enregistrer
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserEditOuvrage;
