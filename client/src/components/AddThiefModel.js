import React, { useState, useRef } from "react";
import { fetchStatus } from "../services/api";

const AddThiefModal = ({ onClose, onUpload, setSystemStatus }) => {
  const [uploading, setUploading] = useState(false);
  const [thiefName, setThiefName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];

    if (!file || !thiefName.trim()) {
      setUploadSuccess("Please select a ZIP file and enter thief name");
      return;
    }

    if (!file.name.endsWith(".zip")) {
      setUploadSuccess("Please upload a ZIP file");
      return;
    }

    setUploading(true);
    try {
      const response = await onUpload(file, thiefName.trim());
      setUploadSuccess(
        `Successfully added ${thiefName} with ${response.images_added} images`
      );
      setThiefName("");
      fileInputRef.current.value = "";
      onClose();

      // Refresh status
      const statusResponse = await fetchStatus();
      setSystemStatus({
        cameraConnected: statusResponse.data.camera === "Connected",
        modelTrained: statusResponse.data.model === "Trained",
        knownThieves: statusResponse.data.known_thieves?.length || 0,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadSuccess(
        error.response?.data?.error || "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Thief</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Thief Name:</label>
            <input
              type="text"
              value={thiefName}
              onChange={(e) => setThiefName(e.target.value)}
              placeholder="Enter thief name"
              required
            />
          </div>
          <div className="form-group">
            <label>Thief Images (ZIP):</label>
            <input type="file" ref={fileInputRef} accept=".zip" required />
            <small className="file-hint">
              Upload a ZIP file containing images of the thief (JPEG/PNG)
            </small>
          </div>
          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={uploading}>
              {uploading ? "Uploading..." : "Add Thief"}
            </button>
          </div>
          {uploadSuccess && (
            <div
              className={`upload-message ${
                uploadSuccess.includes("Success") ? "success" : "error"
              }`}
            >
              {uploadSuccess}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddThiefModal;
