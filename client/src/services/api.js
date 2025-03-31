import axios from "axios";

let audioContext;

const initializeAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log("Audio context initialized");
  }
};

document.addEventListener("click", initializeAudioContext, { once: true });

export const fetchFrame = async (setFrame) => {
  try {
    const response = await axios.get("http://localhost:5000/recognize", {
      responseType: "blob",
    });
    const imageUrl = URL.createObjectURL(response.data);
    setFrame(imageUrl);
  } catch (error) {
    console.error("Error fetching frame:", error);
  }
};

export const fetchAlerts = async (
  setAlert,
  setIsThiefDetected,
  setAlertHistory
) => {
  try {
    const response = await axios.get("http://localhost:5000/alerts");
    if (response.data.alert) {
      setAlert(response.data.alert);
      setIsThiefDetected(true);
      setAlertHistory((prev) => [response.data.alert, ...prev].slice(0, 10));

      // Ensure AudioContext is initialized
      if (!audioContext) {
        console.warn("Audio context not initialized. Click to allow sound.");
        return;
      }

      // Play alarm using Web Audio API
      const audioBuffer = await fetch("/alarm.mp3")
        .then((res) => res.arrayBuffer())
        .then((data) => audioContext.decodeAudioData(data));

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } else {
      setIsThiefDetected(false);
    }
  } catch (error) {
    console.error("Error fetching alerts:", error);
  }
};

export const fetchStatus = async (setSystemStatus) => {
  try {
    const response = await axios.get("http://localhost:5000/status");
    setSystemStatus({
      cameraConnected: response.data.camera === "Connected",
      modelTrained: response.data.model === "Trained",
      knownThieves: response.data.known_thieves?.length || 0,
    });
  } catch (error) {
    console.error("Error checking system status:", error);
  }
};

export const uploadFolder = async (file, thiefName) => {
  const formData = new FormData();
  formData.append("folder", file);
  formData.append("thief_name", thiefName);

  const response = await axios.post(
    "http://localhost:5000/upload_folder",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
