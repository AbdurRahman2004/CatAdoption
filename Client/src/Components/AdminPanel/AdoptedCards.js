import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const AdoptedCards = (props) => {
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showApproved, setShowApproved] = useState(false);
  const [showDeletedSuccess, setshowDeletedSuccess] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  // Ensure props.pet exists before using it
  const pet = props.pet || {};

  const formatTimeAgo = (updatedAt) => {
    const date = new Date(updatedAt);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleReject = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${apiUrl}pets/delete/${pet.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error('Failed to delete pet');
      } else {
        setshowDeletedSuccess(true);
      }
    } catch (err) {
      setShowErrorPopup(true);
      console.error('Error deleting pet:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="req-containter">
      <div className="pet-view-card">
        <div className="pet-card-pic">
          {/* Ensure pet.filename exists before using it */}
          {pet.filename ? (
            <img src={`${pet.filename}`} alt={pet.name} />
          ) : (
            <div>No Image Available</div>
          )}
        </div>
        <div className="pet-card-details">
          <h2>{pet.name}</h2>
          <p><b>Type:</b> {pet.type}</p>
          <p><b>New Owner Email:</b> {pet.email}</p>
          <p><b>New Owner Phone:</b> {pet.phone}</p>
          <p><b>Adopted: </b>{pet.updated_at ? formatTimeAgo(pet.updated_at) : 'Not Available'}</p>
        </div>
        <div className="app-rej-btn">
          <button onClick={handleReject} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : props.deleteBtnText || 'Delete'}
          </button>
        </div>
        
        {/* Show error popup if delete fails */}
        {showErrorPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>Oops! Connection Error</p>
            </div>
            <button onClick={() => setShowErrorPopup(false)} className="close-btn">
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {/* Show success popup after approval */}
        {showApproved && (
          <div className="popup">
            <div className="popup-content">
              <p>Approval Successful...</p>
              <p>
                Please contact the customer at{' '}
                <a href={`mailto:${pet.email}`}>{pet.email}</a> or{' '}
                <a href={`tel:${pet.phone}`}>{pet.phone}</a> to arrange the transfer of the pet.
              </p>
            </div>
            <button
              onClick={() => {
                setShowApproved(false);
                props.updateCards(); // Assuming this updates the list of cards
              }}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}

        {/* Show success popup after deletion */}
        {showDeletedSuccess && (
          <div className="popup">
            <div className="popup-content">
              <p>Deleted Successfully from Database...</p>
            </div>
            <button
              onClick={() => {
                setshowDeletedSuccess(false);
                props.updateCards(); // Assuming this updates the list of cards
              }}
              className="close-btn"
            >
              Close <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptedCards;
