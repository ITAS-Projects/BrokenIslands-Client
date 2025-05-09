import React from "react";

function StepTwo({ data, onNext, onBack, updateFormData }) {
    const handleChange = (e) => {
        updateFormData({ [e.target.name]: e.target.value });
    };

    const createPerson = () => {
      updateFormData({ People: [...(data?.People || []), {}] });
    }

    const deletePerson = (indexToRemove) => {
      const updatedPeople = data.People.filter((_, index) => index !== indexToRemove);
      updateFormData({ People: updatedPeople });
    };
    
    

    const editPersonAtIndex = (index, newData) => {
      const updatedPeople = data.People.map((person, i) =>
        i === index ? { ...person, ...newData } : person
      );

      updateFormData({ People: updatedPeople });
    }

    return (
        <div>
            <h2>Step 2: Adding people</h2>
            <label>
                Number of People:
                <input
                    type="number"
                    name="NumberOfPeople"
                    value={data.NumberOfPeople}
                    onChange={handleChange}
                    min={1}
                    required
                />
            </label>
            <label>
                People with Data: (only needs the reserver, and people with allergies)
            </label>
            {data.People.map((person, index) => (
              <div key={index} className="Person-Object">
                {index !== 0 && (
                  <>
                  {data.People.length > data.NumberOfPeople && (
                    <div className="error">
                    TOO MANY PEOPLE
                    </div>
                  )}
                    <button className={((data.People.length > data.NumberOfPeople) && "Delete") || "next"} onClick={() => {
                      document.querySelectorAll("input").forEach(inputEl => {
                        inputEl.value = '';
                      });
                      deletePerson(index);
                      }}>Delete</button>
                    </>
                  )}
                <label>
                  Name:
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) =>
                      editPersonAtIndex(index, { name: e.target.value })
                    }
                  />
                </label>
                <label>
                  Allergies:
                  <input
                    type="text"
                    value={person.allergies}
                    onChange={(e) =>
                      editPersonAtIndex(index, { allergies: e.target.value })
                    }
                  />
                </label>
              </div>
            ))}

            {data.NumberOfPeople > data.People.length && (<button onClick={createPerson} className="next">+</button>)}
            <div className="button-group">
                <button className="back" onClick={onBack}>Back</button>
                <button className="next" onClick={onNext}>Next</button>
            </div>
        </div>
    );
}

export default StepTwo;
