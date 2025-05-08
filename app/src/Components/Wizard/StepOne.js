import React from "react";

function StepOne({ data, onNext, updateFormData }) {
    const handleChange = (e) => {
        updateFormData({ [e.target.name]: e.target.value });
    };

    const editPersonName = (e) => {
        const updatedPeople = [...data.People]; // shallow copy of array
        updatedPeople[0] = { ...updatedPeople[0], name: e.target.value }; // update only the first person
        updateFormData({ People: updatedPeople });
    }
    

    return (
        <div>
            <h2>Step 1: Basic Info</h2>
            <label>
                Reservation Name:
                <input
                    type="text"
                    value={data.People?.[0]?.name}
                    onChange={editPersonName}
                />
            </label>
            <br />
            <label>
                Arrival:
                <select
                    name="ArrivalSchedule"
                    value={data.ArrivalSchedule || ''}
                    onChange={handleChange}
                >
                    <option value="" disabled>-- Select Arrival Schedule --</option>
                    <option value="Custom AM">Custom AM</option>
                    <option value="Lodge to Secret AM">Lodge to Secret AM</option>
                    <option value="Secret to Lodge AM">Secret to Lodge AM</option>
                    <option value="Custom">Custom</option>
                    <option value="Lodge to Secret PM">Lodge to Secret PM</option>
                    <option value="Secret to Lodge PM">Secret to Lodge PM</option>
                    <option value="Custom PM">Custom PM</option>
                </select>

            </label>
            <div className="dual-input">
                <input
                    type="date"
                    name="ArrivalDay"
                    value={data.ArrivalDay}
                    onChange={handleChange}
                />
                {data.ArrivalSchedule.split(" ")[0] == "Custom" && (<input
                    type="time"
                    name="ArrivalTime"
                    value={data.ArrivalTime}
                    onChange={handleChange}
                />)}
            </div>
            <br />
            <label>
                Departure:
                <select
                    name="DepartureSchedule"
                    value={data.DepartureSchedule || ''}
                    onChange={handleChange}
                >
                    <option value="" disabled>-- Select Departure Schedule --</option>
                    <option value="Custom AM">Custom AM</option>
                    <option value="Lodge to Secret AM">Lodge to Secret AM</option>
                    <option value="Secret to Lodge AM">Secret to Lodge AM</option>
                    <option value="Custom">Custom</option>
                    <option value="Lodge to Secret PM">Lodge to Secret PM</option>
                    <option value="Secret to Lodge PM">Secret to Lodge PM</option>
                    <option value="Custom PM">Custom PM</option>
                </select>

            </label>
            <div className="dual-input">
                <input
                    type="date"
                    name="DepartureDay"
                    value={data.DepartureDay}
                    onChange={handleChange}
                />
                {data.DepartureSchedule.split(" ")[0] == "Custom" && (<input
                    type="time"
                    name="DepartureTime"
                    value={data.DepartureTime}
                    onChange={handleChange}
                />)}
            </div>
            <div className="button-group single">
                <button className="next" onClick={onNext}>Next</button>
            </div>
        </div>
    );
}

export default StepOne;
