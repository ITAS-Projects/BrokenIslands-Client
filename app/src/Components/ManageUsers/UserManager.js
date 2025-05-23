import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axiosAuth from '../authRequest';
import '../../assets/UserManager.css';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const backendURL = process.env.REACT_APP_API_BASE_URL;

const UserManager = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRowIds, setSelectedRowIds] = useState({});
    const navigate = useNavigate();

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
                    <IconButton onClick={() => navigate(`/users/edit/${params.row.id}`)} size="small">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="270 200 210 210">
                            <path d="M276.3 255L416.3 395M323.3 206.7L463.3 346.7M276 267L335 207M461.7 340.9V400.9M409.7 392.9H469.7" stroke="#000" strokeWidth="17" fill="none" />
                        </svg>
                    </IconButton>
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
                    id: user.userId,
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

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete user: ${user.name || 'No Name'}?`)) return;

        try {
            await axiosAuth.delete(`${backendURL}/users`, {
                data: {ids: [user.id]}
            })
            .then(data => {
                fetchUsers();
            });
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    const handleBulkDelete = async () => {
        const idsArray = Array.from(selectedRowIds?.ids || []);
        if (idsArray.length === 0) return;

        if (!window.confirm(`Delete ${idsArray.length} users?`)) return;

        try {
            await axiosAuth.delete(`${backendURL}/users`, {
                data: { ids: idsArray }, // 👈 DELETE with body
            })
            .then(data => {
                setSelectedRowIds({});
                fetchUsers();
            });
        } catch (error) {
            console.error('Bulk delete failed:', error);
        }
    };


    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={() => navigate('/users/create')}>Create User</button>
            </div>

            {selectedRowIds?.ids?.size > 0 && (
                <button onClick={handleBulkDelete} disabled={loading}>
                    Delete Selected ({selectedRowIds?.ids?.size || 0})
                </button>
            )}

            <div style={{ marginBottom: '10px' }}>
                <button onClick={fetchUsers} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            <div style={{ height: 500 }}>
                <DataGrid
                    columns={columns}
                    rows={rows}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    loading={loading}
                    checkboxSelection
                    disableSelectionOnClick
                    onRowSelectionModelChange={(newSelection) => {
                        setSelectedRowIds(newSelection);
                    }}
                />
            </div>
        </div>
    );
};

export default UserManager;
