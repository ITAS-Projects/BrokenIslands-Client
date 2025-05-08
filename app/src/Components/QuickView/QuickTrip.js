import React, { useEffect, useState } from "react";
import axios from 'axios';
import "../../assets/QuickTrip.css";

function QuickTrip() {
    const [loading, setLoading] = useState(true);

    if (loading) {
        return <div>Loading trips...</div>;
    }

    return (
        <div>
            <h1>Quick Trip View</h1>

        </div>
    );
}

export default QuickTrip;
