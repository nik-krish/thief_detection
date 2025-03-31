import React from "react";

const AlertSection = ({ alert }) => {
  return (
    <div className="alert-section">
      <h2>Latest Alert</h2>
      {alert ? (
        <div className="alert-message">{alert}</div>
      ) : (
        <div className="no-alert">No recent alerts</div>
      )}
    </div>
  );
};

export default AlertSection;
