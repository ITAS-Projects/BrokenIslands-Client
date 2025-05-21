import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from 'react-data-grid';
import axiosAuth from '../authRequest';
import 'react-data-grid/lib/styles.css';
import '../../assets/UserManager.css';

const backendURL = process.env.REACT_APP_API_BASE_URL;

const UserManager = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false); // State for "Select All" checkbox
  const [sortInfo, setSortInfo] = useState({ column: '', direction: 'ASC' }); // Sort state

  // Function to handle checkbox changes
  const handleCheckboxChange = (e, row, rowIdx) => {
    const updatedRows = [...rows];
    updatedRows[rowIdx] = { ...row, selected: e.target.checked };
    setRows(updatedRows);
  };

  // Function to handle "Select All" checkbox change
  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    const updatedRows = rows.map(row => ({ ...row, selected: isChecked }));
    setRows(updatedRows);
  };

  // Columns with sortable property
  const columns = [
    {
      key: 'selected',
      width: 50,
      frozen: true,
      name: (
        <input
          type="checkbox"
          checked={selectAll}
          className="userSelectedCheckbox"
          onChange={handleSelectAllChange}
          id="selectAllCheckbox"
        />
      ),
      renderCell: ({ row, rowIdx }) => (
        <input
          type="checkbox"
          className="userSelectedCheckbox"
          checked={row.selected}
          onChange={(e) => handleCheckboxChange(e, row, rowIdx)} // Handling checkbox change
        />
      ),
    },
    { key: 'loginIdList', name: 'Login ID', width: 300, resizable: true, sortable: true },
    { key: 'status', name: 'Status', width: 100, resizable: true },
    { key: 'name', name: 'Name', width: 110, resizable: true },
    { key: 'email', name: 'Email', width: 150, resizable: true },
    { key: 'mainRole', name: 'Role', width: 100, resizable: true },
  ];

  // Fetch users and add 'selected' field
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosAuth.get(`${backendURL}/users`);
      const formattedData = response.data.map(user => ({
        ...user,
        loginIdList: user?.loginIds?.join(', ') || '',
        mainRole: user.roleNames?.[0] || 'Missing',
        selected: false, // Initialize the `selected` field for checkbox
      }));
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

  // Dynamically update the "Select All" checkbox state based on individual row selections
  useEffect(() => {
    const allSelected = rows.every(row => row.selected);
    setSelectAll(allSelected); // Check "Select All" if all are selected
  }, [rows]);

  // Handle sorting
  const handleSort = (columnKey, direction) => {
    console.log("sorting", columnKey, direction);
    const sortedRows = [...rows].sort((a, b) => {
      if (a[columnKey] < b[columnKey]) return direction === 'ASC' ? -1 : 1;
      if (a[columnKey] > b[columnKey]) return direction === 'ASC' ? 1 : -1;
      return 0;
    });
    setRows(sortedRows);
    setSortInfo({ column: columnKey, direction });
  };

  // Toggle sort direction
  const getNextSortDirection = (currentDirection) => {
    return currentDirection === 'ASC' ? 'DESC' : 'ASC';
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={fetchUsers} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div style={{ height: 500 }}>
        <DataGrid
          columns={columns.map(column => ({
            ...column,
            sortDirection: sortInfo.column === column.key ? sortInfo.direction : undefined,
            onSort: () => {
              const newDirection = getNextSortDirection(sortInfo.direction);
              handleSort(column.key, newDirection);
            },
          }))}
          rows={rows}
          onRowsChange={setRows} // Ensure the grid rows are updated correctly
          rowKeyGetter={(row) => row.id}
          defaultColumnOptions={{ resizable: false, sortable: false }}
        />
      </div>
    </div>
  );
};

export default UserManager;
