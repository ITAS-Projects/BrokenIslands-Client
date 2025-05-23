import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import axiosAuth from '../authRequest';

const backendURL = process.env.REACT_APP_API_BASE_URL;

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({ email: '', roles: [] });
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

        const fetchCurrentUser = async () => {
            try {
                const response = await axiosAuth.get(`${backendURL}/users/${id}`);
                const userData = {
                    name: response.data?.name,
                    email: response.data?.email,
                    roles: response.data?.roleNames?.map(role => {
                        return {value: role, label: role};
                    }) || []
                };

                if (!userData.email) {
                    throw new Error("Failed to find user email");
                }
                setCurrentUser(userData);
            } catch (error) {
                console.error("Failed to fetch roles:", error);
                alert("Failed to load user. Please try again later.");
                navigate("/users");
            }
        };

        fetchRoles();
        fetchCurrentUser();
    }, []);

    const handleUpdateUser = async () => {
        if (!currentUser.email) {
            alert("Email is required.");
            return;
        }

        try {
            const response = await axiosAuth.put(`${backendURL}/users/${id}`, {
                roles: currentUser.roles.map(r => r.value) // send only the values
            });

            if (response?.data) {
                alert("User sucessfully edited!");
                navigate('/users');
            } else {
                alert("There was a problem editing this user, please try again.");
            }
        } catch (error) {
            console.error('Failed to edit user:', error);
            alert(error?.response?.data?.error || "An error occurred while editing the user.");
        }
    };

    return (
        <>
            <button onClick={() => navigate("/users")} style={{ padding: '10px 20px' }}>
                Back
            </button>
        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h2>Edit User Roles</h2>

            <div style={{ marginBottom: '1rem' }}>
                <label>Name
                <input
                    type="text"
                    placeholder="Name"
                    value={currentUser.name}
                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                    style={{ width: '100%', padding: '8px' }}
                    disabled
                /></label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label>Email
                <input
                    type="email"
                    placeholder="Email"
                    value={currentUser.email}
                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                    style={{ width: '100%', padding: '8px' }}
                    disabled
                /></label>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label>Roles
                <Select
                    isMulti
                    options={availableRoles}
                    value={currentUser.roles}
                    onChange={(selected) => setCurrentUser({ ...currentUser, roles: selected })}
                    placeholder="Select roles..."
                    closeMenuOnSelect={false}
                /></label>
            </div>

            <button onClick={handleUpdateUser} style={{ padding: '10px 20px' }}>
                Save New Roles
            </button>
        </div>
        </>
    );
};

export default EditUser;
