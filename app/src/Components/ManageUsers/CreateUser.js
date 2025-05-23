import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axiosAuth from '../authRequest';

const backendURL = process.env.REACT_APP_API_BASE_URL;

const CreateUser = () => {
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState({ email: '', roles: [] });
    const [availableRoles, setAvailableRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axiosAuth.get(`${backendURL}/roles`);
                const roleOptions = response.data.map(role => ({
                    value: role.name || role,
                    label: role.name || role
                }));
                setAvailableRoles(roleOptions);
            } catch (error) {
                console.error("Failed to fetch roles:", error);
                alert("Failed to load roles. Please try again later.");
                navigate("/users");
            }
        };

        fetchRoles();
    }, []);

    const handleAddUser = async () => {
        if (!newUser.email) {
            alert("Email is required.");
            return;
        }

        try {
            const response = await axiosAuth.post(`${backendURL}/users`, {
                email: newUser.email,
                roles: newUser.roles.map(r => r.value) // send only the values
            });

            if (response?.data) {
                alert("User created!");
                navigate('/users');
            } else {
                alert("There was a problem adding this user, please try again.");
            }
        } catch (error) {
            console.error('Failed to add user:', error);
            alert(error?.response?.data?.error || "An error occurred while creating the user.");
        }
    };

    return (
        <>
        <button onClick={() => navigate("/users")} style={{ padding: '10px 20px' }}>
                Back
            </button>
        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h2>Create User</h2>

            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    style={{ width: '100%', padding: '8px' }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <Select
                    isMulti
                    options={availableRoles}
                    value={newUser.roles}
                    onChange={(selected) => setNewUser({ ...newUser, roles: selected })}
                    placeholder="Select roles..."
                    closeMenuOnSelect={false}
                />
            </div>

            <button onClick={handleAddUser} style={{ padding: '10px 20px' }}>
                Add User
            </button>
        </div>
        </>
    );
};

export default CreateUser;
