import React from "react";

function StepThree({ data, onNext, onBack, updateFormData }) {
    const handleChange = (e) => {
        updateFormData({ [e.target.name]: e.target.value });
    };

    const createBoat = () => {
        updateFormData({ Boats: [...(data?.Boats || []), {}] });
      }

    const deleteBoat = (indexToRemove) => {
        const updatedBoats = data.Boats.filter((_, index) => index !== indexToRemove);
        updateFormData({ Boats: updatedBoats });
      };

      const editBoatAtIndex = (index, newData) => {
        const updatedBoats = data.Boats.map((boat, i) =>
          i === index ? { ...boat, ...newData } : boat
        );
  
        updateFormData({ Boats: updatedBoats });
      }

    return (
        <div>
            <h2>Step 3: Boats</h2>
            <label>
                Boats:
            </label>
            {data.Boats.map((boat, index) => (
              <div key={index} className="Boat-Object">
                <button className="next" onClick={() => {
                    document.querySelectorAll("input").forEach(inputEl => {
                    inputEl.value = '';
                    });
                    document.querySelectorAll('[type="checkbox"]').forEach(checkboxEl => {
                    checkboxEl.checked = false;
                    });
                    deleteBoat(index);
                    }}>Delete</button>
                <label>
                  Type:
                <select
                    value={boat.type || ''}
                    onChange={e => editBoatAtIndex(index, { type: e.target.value })}
                    >
                    <option value="" disabled>-- Select Type --</option>
                    <option value="Single Kayaks">Single Kayaks</option>
                    <option value="XL Single Kayaks">XL Single Kayaks</option>
                    <option value="Double Kayaks">Double Kayaks</option>
                    <option value="XL Double Kayaks">XL Double Kayaks</option>
                    <option value="Canoes">Canoes</option>
                </select>

                </label>
                <label>
                  Boats are rented:
                  <input
                    type="checkbox"
                    className="inline"
                    checked={boat.rented}
                    onChange={(e) =>
                      editBoatAtIndex(index, { rented: e.target.checked })
                    }
                  />
                </label>
                <label>
                  Number of Boats of this type:
                  <input
                    type="number"
                    className="inline"
                    value={boat.numberOf}
                    onChange={(e) =>
                      editBoatAtIndex(index, { numberOf: e.target.value })
                    }
                    min="1"
                  />
                </label>
              </div>
            ))}
            <button onClick={createBoat} className="next">+</button>
            <div className="button-group">
                <button className="back" onClick={onBack}>Back</button>
                <button className="next" onClick={onNext}>Next</button>
            </div>
        </div>
    );
}

export default StepThree;
