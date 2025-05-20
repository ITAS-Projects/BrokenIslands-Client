import React, { useState, useEffect } from 'react';
import axiosAuth from '../authRequest';

const backendURL = process.env.REACT_APP_API_BASE_URL;

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            // Send request to the backend endpoint
            const response = await axiosAuth(`${backendURL}/users`);

            if (response.status > 300) {
                throw new Error('Failed to fetch users');
            }
            
            setUsers(response.data);  // Set the users from the backend response
        } catch (err) {
            setError('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(); // Fetch users when the component mounts
    }, []);

    return (
        <div>
            <h1>User Manager</h1>
            {loading && <p>Loading users...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {users.length > 0 ? (
                <div>
                    <h2>User List</h2>
                    <ul>
                        {users.map((user, index) => (
                            <li key={index}>
                                <strong>Name:</strong> {user.name ?? 'N/A'} <br />
                                <strong>Email:</strong> {user.email ?? 'N/A'} <br />
                                <strong>Status:</strong> {user.status ?? 'N/A'}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No users found</p>
            )}
        </div>
    );
};

export default UserManager;
