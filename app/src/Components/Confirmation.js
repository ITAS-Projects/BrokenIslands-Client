import React from "react";
import "../assets/Confirmation.css";

function Confirmation({ show, onConfirm, onCancel, message }) {
    if (!show) return null; // Don't render the modal if it's not shown

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
}

export default Confirmation;
