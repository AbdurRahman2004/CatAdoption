import React, { useState, useEffect } from 'react';
import FormCard from './FormCard';

const AdoptingRequests = () => {
  const [forms, setForms] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petDetailsPopup, setPetDetailsPopup] = useState(false); 
  const [selectedPet, setSelectedPet] = useState(null); 
  const [selectedPetId, setSelectedPetId] = useState(''); 

  const fetchForms = async () => {
    try {
      const response = await fetch('http://localhost:4000/form/getForms');
      console.log('Raw response:', response);
      const data = await response.json();
      console.log('Fetched forms:', data);
      setForms(data); // This will update the state
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      const response = await fetch('http://localhost:4000/pets/approvedPets');
      if (!response.ok) {
        throw new Error('An error occurred');
      }
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchForms();
    fetchPets();
  }, []);

  useEffect(() => {
    console.log('Forms state updated:', forms);
  }, [forms]); 

  const petsWithRequests = pets.filter((pet) =>
    forms.some((form) => form.pet_id === pet.id)
  );

  const displayPetDetails = (pet) => {
    setSelectedPet(pet);
    setPetDetailsPopup(true);
  };

  const closePetDetailsPopup = () => {
    setPetDetailsPopup(false);
    setSelectedPet(null); 
  };

  const handlePetChange = (event) => {
    setSelectedPetId(event.target.value);
  };

  const filteredPets = selectedPetId
    ? petsWithRequests.filter(pet => pet.id === selectedPetId)
    : petsWithRequests;

  return (
    <div>
      <div className="dropdown-container" style={{ textAlign: 'right', marginBottom: '20px' }}>
        <select className='req-filter-selection' onChange={handlePetChange} value={selectedPetId}>
          <option value="">All Requets</option>
          {petsWithRequests.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : filteredPets.length > 0 ? (
        filteredPets.map((pet) => {
          const petForms = forms.filter((form) => form.pet_id === pet.id);
          return (
            <div key={pet.id} className='form-container'>
              <div>
                <h2 className='clickable-pet-name' onClick={() => displayPetDetails(pet)}>
                  {pet.name}
                </h2>
              </div>
              <div className='form-child-container'>
                {petForms.map((form) => (
                  <FormCard
                    key={form.id}
                    form={form}
                    pet={pet}
                    updateCards={fetchForms}
                    deleteBtnText={'Reject'}
                    approveBtn={true}
                  />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <p>No adoption requests available for any pet.</p>
      )}

      {petDetailsPopup && selectedPet && (
        <div className='popup'>
          <div className='popup-content'>
            <div className='pet-view-card'>
              <div className='pet-card-pic'>
                <img src={`${selectedPet.filename}`} alt={selectedPet.name} />
              </div>
              <div className='pet-card-details'>
                <h2>{selectedPet.name}</h2>
                <p><b>Type:</b> {selectedPet.type}</p>
                <p><b>Age:</b> {selectedPet.age}</p>
                <p><b>Location:</b> {selectedPet.area}</p>
                <p><b>Owner Email:</b> {selectedPet.email}</p>
                <p><b>Owner Phone:</b> {selectedPet.phone}</p>
                <p><b>Justification:</b> {selectedPet.justification}</p>
              </div>
            </div>
            <button onClick={closePetDetailsPopup} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptingRequests;
