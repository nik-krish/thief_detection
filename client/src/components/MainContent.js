import React from "react";
import AlertSection from "./AlertSection";
import AlertHistory from "./AlertHistory";

const MainContent = ({ frame, alert, alertHistory, systemStatus }) => {
  return (
    <div className="main-content">
      <div className="video-container">
        {frame ? (
          <img src={frame} alt="Live Camera Feed" className="video-feed" />
        ) : (
          <div className="video-placeholder">
            {systemStatus.cameraConnected
              ? "Loading camera feed..."
              : "Camera not connected"}
          </div>
        )}
      </div>

      <div className="info-panel">
        <AlertSection alert={alert} />
        <AlertHistory alertHistory={alertHistory} />
      </div>
    </div>
  );
};

export default MainContent;
