// Login.jsx

import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../helpers/config';
import useValidation from '../custom/useValidation';
import Spinner from '../layouts/Spinner';
import { AuthContext } from '../../context/authContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setAccessToken, setCurrentUser } = useContext(AuthContext);

    useEffect(() => {
        // Load saved credentials on page load
        const savedCredentials = JSON.parse(localStorage.getItem('savedCredentials')) || {};
        const savedEmails = Object.keys(savedCredentials);
        if (savedEmails.length > 0) {
            setEmail(savedEmails[0]);
            setPassword(savedCredentials[savedEmails[0]]);
        }
    }, []);

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        const savedCredentials = JSON.parse(localStorage.getItem('savedCredentials')) || {};
        setPassword(savedCredentials[newEmail] || '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setLoading(true);
        const data = { email, password };

        try {
            const response = await axios.post(`${BASE_URL}/user/login`, data);
            if (response.data.error) {
                setLoading(false);
                toast.error(response.data.error);
            } else {
                localStorage.setItem('currentToken', JSON.stringify(response.data.currentToken));
                setAccessToken(response.data.currentToken);
                setCurrentUser(response.data.user);

                if (rememberMe) {
                    const savedCredentials = JSON.parse(localStorage.getItem('savedCredentials')) || {};
                    savedCredentials[email] = password;
                    localStorage.setItem('savedCredentials', JSON.stringify(savedCredentials));
                }

                setLoading(false);
                setEmail('');
                setPassword('');
                toast.success(response.data.message);

                // Redirect based on user role
                if (response.data.user.role === 1) { // Role 1 = Admin
                    navigate('/dashboard');
                } else { // Role 0 = Standard User
                    navigate('/user/UserProfile');
                }
            }
        } catch (error) {
            setLoading(false);
            if (error?.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            console.error(error);
        }
    };

    return (
        <div className="container">
            <div className="row my-5">
                <div className="col-md-6 mx-auto">
                    <div className="card">
                        <div className="card-header bg-white">
                            <h4 className="text-center mt-2">Login</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address*</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className="form-control"
                                        aria-describedby="emailHelp"
                                    />
                                    {useValidation(errors, 'email')}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password*</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control"
                                    />
                                    {useValidation(errors, 'password')}
                                </div>
                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                                </div>
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    <div className="d-flex justify-content-between">
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
