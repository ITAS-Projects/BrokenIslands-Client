import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axiosAuth from '../authRequest';
import '../../assets/UserManager.css';
import { IconButton } from '@mui/material';

const backendURL = process.env.REACT_APP_API_BASE_URL;

const UserManager = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRowIds, setSelectedRowIds] = useState({});
    const [newUser, setNewUser] = useState({ name: '', email: '', loginIds: '', roles: '' });

    const columns = [
        { field: 'status', headerName: 'Status', width: 100 },
        { field: 'name', headerName: 'Name', width: 110 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'roleList', headerName: 'Roles', width: 120 },
        { field: 'loginIdList', headerName: 'Login ID', width: 300 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            renderCell: (params) => (
                <>
                    {/* Edit Button */}
                    <IconButton onClick={() => handleEdit(params.row)} size="small">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="270 200 210 210">
                            <path d="M276.3 255L416.3 395M323.3 206.7L463.3 346.7M276 267L335 207M461.7 340.9V400.9M409.7 392.9H469.7" stroke="#000" strokeWidth="17" fill="none" />
                        </svg>
                    </IconButton>

                    {/* Delete Button */}
                    <IconButton onClick={() => handleDelete(params.row)} size="small">
                        <svg viewBox="0 0 190 240" xmlns="http://www.w3.org/2000/svg">
                            <path d="M40 227 L140 227 M165 20 L145 230 M15 20 L35 230 M0 20 L180 20 M75 5 L105 5 M105 0 L105 23 M75 0 L75 23" stroke="#000" strokeWidth="15" fill="none" />
                        </svg>
                    </IconButton>
                </>
            ),
        },
    ];

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosAuth.get(`${backendURL}/users`);
            const formattedData = response.data.map(user => {
                const loginIdList = user?.loginIds?.join(', ') || 'unknown';
                const roleList = user?.roleNames?.join(', ') || 'Missing';
                return {
                    ...user,
                    id: user.userId, // Required by DataGrid
                    loginIdList,
                    roleList
                };
            });
            setRows(formattedData);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        console.log(selectedRowIds?.ids?.size);
    }, [selectedRowIds]);

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete user: ${user.name}?`)) return;

        try {
            await axiosAuth.delete(`${backendURL}/users/${user.id}`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleEdit = (user) => {
        // For now just alert — later we’ll use a modal/form
        alert(`Edit user: ${user.name}`);
    };

    // Handle Bulk Delete
    const handleBulkDelete = async () => {
        if (selectedRowIds?.ids?.size === 0) return;

        if (!window.confirm(`Delete ${selectedRowIds?.ids?.size} users?`)) return;

        try {
            console.log(Array.from(selectedRowIds?.ids));
            await Promise.all(
                Array.from(selectedRowIds?.ids).map((id) =>
                    axiosAuth.delete(`${backendURL}/users/${id}`)
                )
            );
            setSelectedRowIds({});
            fetchUsers();
        } catch (error) {
            console.error('Bulk delete failed:', error);
        }
    };

    // Handle New User Add
    const handleAddUser = async () => {
        const payload = {
            name: newUser.name,
            email: newUser.email,
            loginIds: newUser.loginIds.split(',').map(s => s.trim()),
            roleNames: newUser.roles.split(',').map(s => s.trim()),
        };

        try {
            await axiosAuth.post(`${backendURL}/users`, payload);
            setNewUser({ name: '', email: '', loginIds: '', roles: '' });
            fetchUsers();
        } catch (error) {
            console.error('Failed to add user:', error);
        }
    };

    return (
        <div>
            {/* Add User Form */}
            <div style={{ marginBottom: '10px' }}>
                <input
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <input
                    placeholder="Login IDs (comma separated)"
                    value={newUser.loginIds}
                    onChange={(e) => setNewUser({ ...newUser, loginIds: e.target.value })}
                />
                <input
                    placeholder="Roles (comma separated)"
                    value={newUser.roles}
                    onChange={(e) => setNewUser({ ...newUser, roles: e.target.value })}
                />
                <button onClick={handleAddUser}>Add User</button>
            </div>

            {/* Bulk Delete Button */}
            {selectedRowIds?.ids?.size > 0 && (
                <button onClick={handleBulkDelete} disabled={loading}>
                    Delete Selected ({selectedRowIds?.ids?.size})
                </button>
            )}

            {/* Refresh Button */}
            <div style={{ marginBottom: '10px' }}>
                <button onClick={fetchUsers} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Data Grid */}
            <div style={{ height: 500 }}>
                <DataGrid
                    columns={columns}
                    rows={rows}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    loading={loading}
                    checkboxSelection
                    disableSelectionOnClick
                    onRowSelectionModelChange={(newSelection, details) => {
                        // console.log(newSelection);
                        // console.log(details);
                        setSelectedRowIds(newSelection);
                    }}
                />
            </div>
        </div>
    );
};

export default UserManager;
