import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import AddThiefModal from "./components/AddThiefModel";
import {
  fetchFrame,
  fetchAlerts,
  fetchStatus,
  uploadFolder,
} from "./services/api";
import "./App.css";

function App() {
  const [alert, setAlert] = useState(null);
  const [frame, setFrame] = useState(null);
  const [isThiefDetected, setIsThiefDetected] = useState(false);
  const [alertHistory, setAlertHistory] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    cameraConnected: false,
    modelTrained: false,
    knownThieves: 0,
  });
  const [isLive, setIsLive] = useState(false);
  const [showAddThiefModal, setShowAddThiefModal] = useState(false);

  // Toggle live indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch video frame
  useEffect(() => {
    const interval = setInterval(() => fetchFrame(setFrame), 200);
    return () => clearInterval(interval);
  }, []);

  // Fetch alerts
  useEffect(() => {
    const interval = setInterval(
      () => fetchAlerts(setAlert, setIsThiefDetected, setAlertHistory),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  // Fetch system status
  useEffect(() => {
    fetchStatus(setSystemStatus);
    const interval = setInterval(() => fetchStatus(setSystemStatus), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`app-container ${isThiefDetected ? "alert-mode" : ""}`}>
      <Header
        isThiefDetected={isThiefDetected}
        onAddThiefClick={() => setShowAddThiefModal(true)}
      />

      <MainContent
        frame={frame}
        alert={alert}
        alertHistory={alertHistory}
        systemStatus={systemStatus}
      />

      <Footer isLive={isLive} systemStatus={systemStatus} />

      {showAddThiefModal && (
        <AddThiefModal
          onClose={() => setShowAddThiefModal(false)}
          onUpload={uploadFolder}
          setSystemStatus={setSystemStatus}
        />
      )}
    </div>
  );
}

export default App;
