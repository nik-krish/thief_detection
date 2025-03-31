import React from "react";

const AlertHistory = ({ alertHistory }) => {
  return (
    <div className="alert-history">
      <h3>Alert History</h3>
      <ul>
        {alertHistory.length > 0 ? (
          alertHistory.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <li>No alerts recorded</li>
        )}
      </ul>
    </div>
  );
};

export default AlertHistory;
