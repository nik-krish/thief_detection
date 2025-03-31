import React from "react";

const Footer = ({ isLive, systemStatus }) => {
  return (
    <div className="footer">
      <div className="footer-left">
        <div className={`live-indicator ${isLive ? "active" : ""}`}>LIVE</div>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>

      <div className="footer-right">
        <div className="status-item">
          <span>Camera: </span>
          <span
            className={
              systemStatus.cameraConnected ? "connected" : "disconnected"
            }
          >
            {systemStatus.cameraConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="status-item">
          <span>Model: </span>
          <span
            className={systemStatus.modelTrained ? "connected" : "disconnected"}
          >
            {systemStatus.modelTrained ? "Trained" : "Not Trained"}
          </span>
        </div>

        <div className="status-item">
          <span>Thieves: </span>
          <span>{systemStatus.knownThieves}</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
