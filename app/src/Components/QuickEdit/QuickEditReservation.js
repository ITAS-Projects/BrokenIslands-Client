import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../assets/QuickEditReservation.css";

function QuickEditReservation() { 
    const { id } = useParams();

    return(
        <div>Hello World {id}</div>
    )
}

export default QuickEditReservation;