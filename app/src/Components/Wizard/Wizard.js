import React, { useState } from "react";
import "../../assets/Wizard.css";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import Review from "./Review";

function Wizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        ArrivalDay: "",
        ArrivalTime: "",
        ArrivalSchedule: "",
        DepartureDay: "",
        DepartureTime: "",
        DepartureSchedule: "",
        NumberOfPeople: 1,
        People: [{name: "", allergies: ""}],
        Boats: [],
    });

    const updateFormData = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    return (
        <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
            <h1>Creating Reservation Taxi Trips</h1>
            {step === 1 && (
                <StepOne
                    data={formData}
                    onNext={() => setStep(2)}
                    updateFormData={updateFormData}
                />
            )}
            {step === 2 && (
                <StepTwo
                    data={formData}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                    updateFormData={updateFormData}
                />
            )}
            {step === 3 && (
                <StepThree
                    data={formData}
                    onNext={() => setStep(4)}
                    onBack={() => setStep(2)}
                    updateFormData={updateFormData}
                />
            )}
            {step === 4 && (
                <Review
                    data={formData}
                    onBack={() => setStep(3)}
                />
            )}
        </div>
    );
}

export default Wizard;
