import React from "react";

const Header = ({ isThiefDetected, onAddThiefClick }) => {
  return (
    <div className="header">
      <h1>Thief Detection System</h1>
      <div className="header-controls">
        <div
          className={`status-indicator ${isThiefDetected ? "alert" : "safe"}`}
        >
          {isThiefDetected ? "ALERT: THIEF DETECTED!" : "System Normal"}
        </div>
        <button className="add-thief-btn" onClick={onAddThiefClick}>
          + Add New Thief
        </button>
      </div>
    </div>
  );
};

export default Header;
