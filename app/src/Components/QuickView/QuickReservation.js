import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../../assets/QuickReservation.css";

function QuickReservation() {
    const [loading, setLoading] = useState(true);

    if (loading) {
        return <div>Loading reservations...</div>;
    }

    return (
        <div>
            <h1>Quick Reservation View</h1>

        </div>
    );
}

export default QuickReservation;
