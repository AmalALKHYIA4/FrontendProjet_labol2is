import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserInfo() {
    const { currentUser } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                try {
                    const response = await axios.get(`http://localhost:8000/api/members/user/${currentUser.id}`);
                    console.log('Données reçues de l\'API:', response.data);
                    setUserData(response.data);
                } catch (error) {
                    console.error('Erreur lors de la récupération des données:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [currentUser]);

    const handleEditClick = () => {
        navigate(`/user/edit-user/${currentUser.id}`);
    };

    return (
        <div style={styles.container}>
            {loading ? (
                <p style={styles.loadingText}>Loading user information...</p>
            ) : userData ? (
                <div style={styles.userInfo}>
                    {userData.image && (
                        <div style={styles.userImageContainer}>
                            <img 
                                src={`http://localhost:8000/storage/${userData.image}`} 
                                alt="User"
                                style={styles.userImage}
                            />
                        </div>
                    )}
                    <div style={styles.userDetails}>
                        <div style={styles.userDetailContainer}>
                            <strong style={styles.label}>Name</strong>
                            <p style={styles.userDetail}>{currentUser.name}</p>
                        </div>
                        <div style={styles.userDetailContainer}>
                            <strong style={styles.label}>Email</strong>
                            <p style={styles.userDetail}>{currentUser.email}</p>
                        </div>
                        <div style={styles.userDetailContainer}>
                            <strong style={styles.label}>Position</strong>
                            <p style={styles.userDetail}>{userData.position}</p>
                        </div>
                        <div style={styles.userDetailContainer}>
                            <strong style={styles.label}>Team ID</strong>
                            <p style={styles.userDetail}>{userData.team_id}</p>
                        </div>
                        <div style={styles.userDetailContainer}>
                            <strong style={styles.label}>Bio</strong>
                            <p style={styles.userDetail}>{userData.bio}</p>
                        </div>
                        <div style={styles.userDetailContainer}>
                            <strong style={styles.label}>Contact Info</strong>
                            <p style={styles.userDetail}>{userData.contact_info}</p>
                        </div>
                        {/* <div style={styles.userDetailContainer}>
                            <strong style={styles.label}>Status</strong>
                            <p style={styles.userDetail}>{userData.statut}</p>
                        </div> */}
                        <button onClick={handleEditClick} style={styles.editButton}>
                            Edit
                        </button>
                    </div>
                </div>
            ) : (
                <p style={styles.loadingText}>User information not found</p>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '90px',
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
        position: 'relative',
    },
    userImageContainer: {
        position: 'absolute',
        top: '-90px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '5px solid #fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#fff',
    },
    userImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    userDetails: {
        marginTop: '80px',
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
    userDetail: {
        flex: '3',
        fontSize: '18px',
        color: '#555',
        margin: 0,
    },
    editButton: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    loadingText: {
        fontSize: '18px',
        color: '#888',
    },
};

export default UserInfo;
