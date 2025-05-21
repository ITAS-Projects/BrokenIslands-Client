import React, { useState, useEffect } from 'react';
import axiosAuth from '../authRequest';
import UserCard from './UserCard'; // adjust the path if necessary

const backendURL = process.env.REACT_APP_API_BASE_URL;

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        setLoading(true);
        axiosAuth(`${backendURL}/users`)
            .then(response => {
                if (response.status > 300) throw new Error('Failed to fetch users');
                setUsers(response.data);
            })
            .catch(err => {
                const errorMsg = err?.response?.data?.error || err.message || "Unknown error";
                console.error("Fetch users error:", errorMsg, err);
                alert(`Error: ${errorMsg}`);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h1>User Manager</h1>
            <button onClick={fetchUsers} disabled={loading} style={{ marginBottom: '1rem' }}>
                Refresh
            </button>
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {users.length > 0 ? (
                        users.map(user => (
                            <UserCard key={user.userId} user={user} />
                        ))
                    ) : (
                        <p>No users found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserManager;
