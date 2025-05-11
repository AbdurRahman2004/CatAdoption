import React, { useState } from 'react';

const UpdatePetForm = ({ pet, onUpdate, onCancel }) => {
  const [updatedPet, setUpdatedPet] = useState({ ...pet });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPet((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdate(updatedPet);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h4 className="text-xl font-semibold text-blue-600 mb-4">Update Pet Details</h4>

        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 mb-1">Name:</label>
          <input
            type="text"
            name="name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={updatedPet.name}
            onChange={handleInputChange}
          />

          <label className="block text-gray-700 mb-1">Type:</label>
          <input
            type="text"
            name="type"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={updatedPet.type}
            onChange={handleInputChange}
          />

          <label className="block text-gray-700 mb-1">Age:</label>
          <input
            type="number"
            name="age"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={updatedPet.age}
            onChange={handleInputChange}
          />

          <label className="block text-gray-700 mb-1">Location:</label>
          <input
            type="text"
            name="area"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={updatedPet.area}
            onChange={handleInputChange}
          />

          <label className="block text-gray-700 mb-1">Justification:</label>
          <textarea
            name="justification"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={updatedPet.justification}
            onChange={handleInputChange}
          ></textarea>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePetForm;
