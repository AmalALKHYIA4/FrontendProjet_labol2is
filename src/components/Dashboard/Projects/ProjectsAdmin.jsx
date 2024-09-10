import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const ProjectsAdmin = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const { accessToken } = useContext(AuthContext);

    useEffect(() => {
        fetchProjects();
    }, [accessToken]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/projects', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects', error);
            setError('Error fetching projects');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await axios.delete(`http://localhost:8000/api/projects/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setProjects(projects.filter(project => project.id !== id));
            } catch (error) {
                console.error('Error deleting project', error);
                setError('Error deleting project');
            }
        }
    };

    return (
        <div>
            <h1>Manage Projects</h1>
            <Link to="/dashboard/ProjectsCreate" className="btn btn-primary mb-4">Add Project</Link>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Funding Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {projects.length ? (
                        projects.map(project => (
                            <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{project.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.team}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.start_date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.end_date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.funding_type}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{project.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/dashboard/ProjectsEdit/${project.id}`} className="btn btn-primary mb-2">Edit</Link>
                                    <button onClick={() => handleDelete(project.id)} className="btn btn-primary mb-2">Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-4">No projects available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectsAdmin;
