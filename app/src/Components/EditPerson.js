import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate  } from 'react-router-dom';

const EditPerson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [person, setPerson] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  // Fetch the person data to edit
  useEffect(() => {
    axios.get(`http://localhost:8081/people/${id}`)
      .then(response => {
        setPerson(response.data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching person:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerson(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8081/people/${id}`, person)
      .then(response => {
        alert('Person updated successfully');
        navigate('/data'); // Redirect to the home page
      })
      .catch(error => console.error('Error updating person:', error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => window.location.href = `/data`}>&lt; Back</button>
      <h1>Edit Person</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input 
            type="text" 
            name="name" 
            value={person.name} 
            onChange={handleChange} 
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input 
            type="email" 
            name="email" 
            value={person.email} 
            onChange={handleChange} 
            required
          />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditPerson;
