import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';

const EditUser = () => {
    const { currentUser } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        position: '',
        team_id: '',
        bio: '',
        contact_info: '',
        image: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [memberId, setMemberId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/members/user/${id}`);
                setUserData(response.data);
                setMemberId(response.data.id);
                if (response.data.image) {
                    setImagePreview(`http://localhost:8000/storage/${response.data.image}`);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData((prevState) => ({
                    ...prevState,
                    image: reader.result,
                }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(`http://localhost:8000/api/user/${currentUser.id}`, {
                name: userData.name,
                email: userData.email,
            });

            if (memberId) {
                await axios.put(`http://localhost:8000/api/member/${memberId}`, {
                    position: userData.position,
                    bio: userData.bio,
                    contact_info: userData.contact_info,
                    user_id: currentUser.id,
                    image: userData.image,
                });
            }

            alert('User information updated successfully.');
            navigate('/user/UserInfo');
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('An error occurred while updating user information.');
        }
    };

    return (
        <div style={styles.container}>
            {loading ? (
                <p style={styles.loadingText}>Loading user information...</p>
            ) : (
                <div style={styles.userInfo}>
                    <h2>Edit User Information</h2>
                    {Object.entries(userData).map(([key, value]) => (
                        key !== 'image' && (
                            <div style={styles.userDetailContainer} key={key}>
                                <strong style={styles.label}>{capitalizeFirstLetter(key)}</strong>
                                {key === 'bio' ? (
                                    <textarea
                                        name={key}
                                        value={value}
                                        onChange={handleInputChange}
                                        style={styles.textarea}
                                    />
                                ) : (
                                    <input
                                        type={key === 'email' ? 'email' : 'text'}
                                        name={key}
                                        value={value}
                                        onChange={handleInputChange}
                                        style={styles.input}
                                    />
                                )}
                            </div>
                        )
                    ))}
                    <div style={styles.userDetailContainer}>
                        <strong style={styles.label}>Profile Image</strong>
                        {imagePreview && (
                            <div style={styles.imagePreviewContainer}>
                                <img src={imagePreview} alt="Profile Preview" style={styles.imagePreview} />
                            </div>
                        )}
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            style={styles.input}
                        />
                    </div>
                    <button onClick={handleSaveClick} style={styles.saveButton}>
                        Save
                    </button>
                </div>
            )}
        </div>
    );
};

// Utility function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const styles = {
    container: {
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        margin: 'auto',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
    },
    userInfo: {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    userDetailContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #eee',
    },
    label: {
        flex: '1',
        textAlign: 'right',
        marginRight: '12px',
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        flex: '3',
        padding: '8px',
        fontSize: '16px',
        color: '#555',
        border: '1px solid #ccc',
        borderRadius: '4px',
        margin: 0,
    },
    textarea: {
        flex: '3',
        padding: '8px',
        fontSize: '16px',
        color: '#555',
        border: '1px solid #ccc',
        borderRadius: '4px',
        margin: 0,
        height: '80px',
    },
    saveButton: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#28a745',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    loadingText: {
        fontSize: '18px',
        color: '#888',
    },
    imagePreviewContainer: {
        marginBottom: '12px',
    },
    imagePreview: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4px',
    },
};

export default EditUser;
