import React from 'react';
import PropTypes from 'prop-types';
import "../../assets/UserCard.css"; // Import the CSS file

const UserCard = ({ user }) => {
    const formatDate = (timestamp) => {
        return timestamp ? new Date(timestamp).toLocaleString() : 'N/A';
    };

    return (
        <div className="user-card"> {/* Apply the CSS class here */}
            {user.picture && (
                <img
                    src={user.picture}
                    alt={`Profile picture of ${user.name || 'user'}`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/225-default-avatar.png";
                    }}
                />
            )}
            <div><strong>Full Name:</strong> {user.name ?? 'N/A'}</div>
            <div><strong>Given Name:</strong> {user.givenName ?? 'N/A'}</div>
            <div><strong>Middle Name:</strong> {user.middleName || 'N/A'}</div>
            <div><strong>Family Name:</strong> {user.familyName ?? 'N/A'}</div>
            <div><strong>Email:</strong> {user.email ?? 'N/A'} {user.verifiedEmail ? '✅' : '❌'}</div>
            <div><strong>Status:</strong> {user.status ?? 'N/A'}</div>
            <div><strong>User ID:</strong> {user.userId ?? 'N/A'}</div>
            <div><strong>Login IDs:</strong> {user.loginIds?.join(', ') || 'N/A'}</div>
            <div><strong>External IDs:</strong> {user.externalIds?.join(', ') || 'N/A'}</div>
            <div><strong>Roles:</strong> {user.roleNames?.join(', ') || 'N/A'}</div>
            <div><strong>Created:</strong> {formatDate(user.createdTime)}</div>
            <button 
                onClick={() => window.location.href = `/user-profile/${user.userId}`} 
                className="view-profile-button"
            >
                View Profile
            </button>
        </div>
    );
};

UserCard.propTypes = {
    user: PropTypes.shape({
        picture: PropTypes.string,
        name: PropTypes.string,
        givenName: PropTypes.string,
        middleName: PropTypes.string,
        familyName: PropTypes.string,
        email: PropTypes.string,
        verifiedEmail: PropTypes.bool,
        status: PropTypes.string,
        userId: PropTypes.string,
        loginIds: PropTypes.arrayOf(PropTypes.string),
        externalIds: PropTypes.arrayOf(PropTypes.string),
        roleNames: PropTypes.arrayOf(PropTypes.string),
        createdTime: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.instanceOf(Date)
        ])
    }).isRequired
};

export default UserCard;
