import React, { useState } from 'react';

const InteractiveRating = ({ initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleRatingClick = (newRating) => {
    setRating(newRating);
    onRatingChange(newRating);
    setIsEditing(false);
  };

  const handleMouseEnter = (starIndex) => {
    if (isEditing) {
      setHoveredRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const renderStar = (starIndex) => {
    const filled = (isEditing ? hoveredRating : rating) >= starIndex;
    return (
      <span
        key={starIndex}
        className={`star ${filled ? 'filled' : 'empty'} ${isEditing ? 'editable' : ''}`}
        onClick={() => isEditing && handleRatingClick(starIndex)}
        onMouseEnter={() => handleMouseEnter(starIndex)}
        onMouseLeave={handleMouseLeave}
      >
        {filled ? '★' : '☆'}
      </span>
    );
  };

  return (
    <div className="interactive-rating">
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map(starIndex => renderStar(starIndex))}
      </div>
      <button 
        className="rating-edit-button" 
        onClick={toggleEditing}
      >
        {isEditing ? 'Cancel' : rating > 0 ? 'Edit Rating' : 'Rate'}
      </button>
      <style jsx>{`
        .interactive-rating {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .stars-container {
          display: flex;
        }
        .star {
          font-size: 24px;
          cursor: default;
          color: #ccc;
        }
        .star.filled {
          color: #ffc107;
        }
        .star.editable {
          cursor: pointer;
        }
        .rating-edit-button {
          padding: 5px 10px;
          background-color: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 4px;
          cursor: pointer;
        }
        .rating-edit-button:hover {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default InteractiveRating;