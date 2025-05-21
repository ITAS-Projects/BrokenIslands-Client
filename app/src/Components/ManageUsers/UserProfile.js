import { UserManagement, UserProfile } from '@descope/react-sdk';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To capture the user ID from the URL

// Mock function to fetch user data (replace with an actual API call)
const fetchUserData = (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                userId,
                name: 'John Doe',
                givenName: 'John',
                middleName: 'A.',
                familyName: 'Doe',
                email: 'john.doe@example.com',
                verifiedEmail: true,
                status: 'Active',
                picture: 'https://via.placeholder.com/150',
                roleNames: ['Admin', 'User'],
                createdTime: '2023-05-21T10:00:00Z'
            });
        }, 1000); // Simulate API delay
    });
};

const UserProfile2 = () => {
    const { userId } = useParams(); // Get userId from the URL
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            const data = await fetchUserData(userId);
            setUserData(data);
        };

        getUserData();
    }, [userId]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div style={profileContainerStyle}>
            <h2>User Profile</h2>
            <div style={profileCardStyle}>
                {userData.picture && (
                    <img
                        src={userData.picture}
                        alt={`${userData.name}'s profile`}
                        style={profileImageStyle}
                    />
                )}
                <div><strong>Full Name:</strong> {userData.name}</div>
                <div><strong>Given Name:</strong> {userData.givenName}</div>
                <div><strong>Middle Name:</strong> {userData.middleName}</div>
                <div><strong>Family Name:</strong> {userData.familyName}</div>
                <div><strong>Email:</strong> {userData.email} {userData.verifiedEmail ? '✅' : '❌'}</div>
                <div><strong>Status:</strong> {userData.status}</div>
                <div><strong>User ID:</strong> {userData.userId}</div>
                <div><strong>Roles:</strong> {userData.roleNames.join(', ')}</div>
                <div><strong>Account Created:</strong> {formatDate(userData.createdTime)}</div>
            </div>
        </div>
    );
};

// Styles (adjust as necessary)
const profileContainerStyle = {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontSize: '1rem',
    textAlign: 'center'
};

const profileCardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginTop: '1rem'
};

const profileImageStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    marginBottom: '1rem'
};

const UserProfiles = () => {
    return(
        <>
        <div>
            <h1>User Profile</h1>
            <UserManagement
                tenant= {process.env.REACT_APP_DESCOP_PROJECT_ID}       // Required
                widgetId="user-management-widget"                          // Required
            />
        </div>
        </>
    );
}

export default UserProfiles;
