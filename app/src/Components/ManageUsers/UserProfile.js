import { UserManagement, useUser } from '@descope/react-sdk';
import React from 'react';

const UserProfile = () => {
    const { user } = useUser(); // Get the current user

    if (!user) {
        return <div>Loading user information...</div>;
    }

    const tenantId = user?.userTenants?.[0]?.tenantId;

    return (
    <div className="user-profile-container">
        <h1>User Profile</h1>
        {tenantId ? (
        <UserManagement tenant={tenantId} widgetId="user-management-widget" />
        ) : (
        <p>Invalid data</p>
        )}
    </div>
    );

};

export default UserProfile;
