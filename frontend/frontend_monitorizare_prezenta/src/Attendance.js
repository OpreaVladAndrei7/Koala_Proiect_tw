import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { QrReader } from "react-qr-reader";

function Attendance() {
  const userId = localStorage.getItem("userId");
  const [manualCode, setManualCode] = useState("");
  const [scannedCode, setScannedCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleManualSubmit = () => {
    if (manualCode.trim() === "") {
      setErrorMessage("Please enter a valid code.");
      return;
    }
    setErrorMessage("");
    submitAttendance(manualCode);
  };

  const submitAttendance = async (code) => {
    try {
      const response = await fetch(`/api/attendances/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode: code, userId: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(
          `Attendance marked successfully for event: ${data.eventName}`
        );
        setManualCode("");
        setScannedCode("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to mark attendance.");
      }
    } catch (error) {
      console.error("Error submitting attendance: ", error);
      setErrorMessage("An error occurred while marking attendance.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Mark Your Attendance</h1>
      <div className="card mb-4">
        <div className="card-header">Scan QR Code</div>
        <div className="card-body text-center">
          <QrReader
            onResult={(result, error) => {
              if (result) {
                setScannedCode(result.text);
                submitAttendance(result.text);
              }
              if (error) {
                console.error("QR Reader Error: ", error);
              }
            }}
            constraints={{
              facingMode: "environment",
            }}
            style={{ width: "100%" }}
          />
          {scannedCode && <p className="mt-3">Scanned Code: {scannedCode}</p>}
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger mt-3" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">Enter Code Manually</div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="manualCode" className="form-label">
              Enter Access Code
            </label>
            <input
              type="text"
              className="form-control"
              id="manualCode"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleManualSubmit}>
            Submit Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
