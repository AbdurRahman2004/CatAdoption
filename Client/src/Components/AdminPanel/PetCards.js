import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import './Admin.css';

const PetCards = (props) => {
  const [showJustificationPopup, setShowJustificationPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setShowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedPet, setUpdatedPet] = useState({ ...props.pet });

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
  };

  const maxLength = 40;

  const formatTimeAgo = (updatedAt) => {
    if (!updatedAt) return 'Unknown time';
    const date = new Date(updatedAt);
    if (isNaN(date.getTime())) return 'Invalid date';
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      console.log(props.pet.id);
      const response = await fetch(`http://localhost:4000/pets/approving/${props.pet.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: "Approved" }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        console.log(response);
        setShowErrorPopup(true);
      } else {
        console.log(response);
        setShowApproved(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
    } finally {
      setIsApproving(false);
    }
  };

  const deleteFormsAdoptedPet = async () => {
    setIsDeleting(true);
    try {
      const deleteResponses = await fetch(`http://localhost:4000/form/delete/many/${props.pet.id}`, {
        method: 'DELETE'
      });
      if (!deleteResponses.ok) throw new Error('Failed to delete forms');
    } catch (err) {
      // handle error if needed
    } finally {
      handleReject();
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`http://localhost:4000/pets/delete/${props.pet.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error('Failed to delete pet');
      } else {
        setShowDeletedSuccess(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
      console.error('Error deleting pet:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPet((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:4000/pets/update/${props.pet.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPet),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        setShowErrorPopup(true);
      } else {
        setUpdatedPet({ ...updatedPet });
        setIsUpdating(false);
        setShowJustificationPopup(false);
      }
    } catch (err) {
      setShowErrorPopup(true);
    }
  };

  return (
    <div className='req-containter'>
      <div className='pet-view-card'>
        <div className='pet-card-pic'>
          <img src={`http://localhost:4000/images/${props.pet.filename}`} alt={props.pet.name} />
        </div>
        <div className='pet-card-details'>
          <h2>{props.pet.name}</h2>
          <p><b>Type:</b> {props.pet.type}</p>
          <p><b>Age:</b> {props.pet.age}</p>
          <p><b>Location:</b> {props.pet.area}</p>
          <p><b>Owner Email:</b> {props.pet.email}</p>
          <p><b>Owner Phone:</b> {props.pet.phone}</p>
          <p>
            <b>Justification:</b>
            <span>
              {truncateText(props.pet.justification, maxLength)}
              {props.pet.justification?.length > maxLength && (
                <span onClick={() => setShowJustificationPopup(!showJustificationPopup)} className='read-more-btn'>
                  Read More
                </span>
              )}
            </span>
          </p>
          <p>{formatTimeAgo(props.pet.updatedAt)}</p>
        </div>
        <div className='app-rej-btn'>
          <button onClick={deleteFormsAdoptedPet} disabled={isDeleting || isApproving}>
            {isDeleting ? 'Deleting...' : props.deleteBtnText}
          </button>
          {props.approveBtn && (
            <button disabled={isDeleting || isApproving} onClick={handleApprove}>
              {isApproving ? 'Approving...' : 'Approve'}
            </button>
          )}
          <button onClick={() => setShowJustificationPopup(true)} disabled={isDeleting || isApproving || isUpdating}>
            Update
          </button>
        </div>

        {/* Justification Popup */}
        {showJustificationPopup && (
          <div className='popup'>
            <div className='popup-content'>
              <h4>Justification:</h4>
              <p>{props.pet.justification}</p>
              <form onSubmit={handleUpdateSubmit}>
                <input
                  type="text"
                  name="name"
                  value={updatedPet.name}
                  onChange={handleUpdateChange}
                  placeholder="Pet Name"
                />
                <input
                  type="text"
                  name="type"
                  value={updatedPet.type}
                  onChange={handleUpdateChange}
                  placeholder="Pet Type"
                />
                <input
                  type="number"
                  name="age"
                  value={updatedPet.age}
                  onChange={handleUpdateChange}
                  placeholder="Age"
                />
                <input
                  type="text"
                  name="area"
                  value={updatedPet.area}
                  onChange={handleUpdateChange}
                  placeholder="Location"
                />
                <input
                  type="email"
                  name="email"
                  value={updatedPet.email}
                  onChange={handleUpdateChange}
                  placeholder="Owner Email"
                />
                <input
                  type="tel"
                  name="phone"
                  value={updatedPet.phone}
                  onChange={handleUpdateChange}
                  placeholder="Owner Phone"
                />
                <textarea
                  name="justification"
                  value={updatedPet.justification}
                  onChange={handleUpdateChange}
                  placeholder="Justification"
                />
                <button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
              </form>
            </div>
            <button onClick={() => setShowJustificationPopup(false)} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {/* Error Popup */}
        {showErrorPopup && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Oops!... Connection Error</p>
            </div>
            <button onClick={() => setShowErrorPopup(false)} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {/* Approved Popup */}
        {showApproved && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Approval Successful...</p>
              <p>
                Please contact the customer at{' '}
                <a href={`mailto:${props.pet.email}`}>{props.pet.email}</a>{' '}
                or{' '}
                <a href={`tel:${props.pet.phone}`}>{props.pet.phone}</a>{' '}
                to arrange the transfer of the pet.
              </p>
            </div>
            <button onClick={() => {
              setShowApproved(false);
              props.updateCards();
            }} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {/* Deleted Success Popup */}
        {showDeletedSuccess && (
          <div className='popup'>
            <div className='popup-content'>
              <p>Deleted Successfully from Database...</p>
            </div>
            <button onClick={() => {
              setShowDeletedSuccess(false);
              props.updateCards();
            }} className='close-btn'>
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetCards;
