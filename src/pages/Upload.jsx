import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import HMPIGauge from "../components/HMPIGauge";
import "./Upload.css";

function Upload() {
  const navigate = useNavigate();

  const locations = [
    { city: "Ranchi", state: "Jharkhand", country: "India" },
    { city: "Delhi", state: "Delhi", country: "India" },
    { city: "Bhubaneswar", state: "Odisha", country: "India" },
  ];

  const [formData, setFormData] = useState({
    city: "",
    state: "",
    country: "",
    iron: "",
    copper: "",
    zinc: "",
    lead: "",
    cadmium: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // ===== Safe limits (mg/L) & weights for HMPI =====
  const safeLimits = {
    lead: 0.01,
    cadmium: 0.003,
    iron: 0.3,
    copper: 1,
    zinc: 5
  };

  const weights = {
    lead: 0.25,
    cadmium: 0.25,
    iron: 0.2,
    copper: 0.15,
    zinc: 0.15
  };

  // ===== Handlers =====
  const handleLocationChange = (e) => {
    const location = locations.find((loc) => loc.city === e.target.value);
    if (location) {
      setFormData((prev) => ({
        ...prev,
        city: location.city,
        state: location.state,
        country: location.country,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePredict = () => {
    // Validate location
    if (!formData.city || !formData.state || !formData.country) {
      alert("⚠️ Please select your location.");
      return;
    }

    const metals = ["iron", "copper", "zinc", "lead", "cadmium"];
    const values = metals.map((m) => Number(formData[m]));

    if (values.some((val) => isNaN(val))) {
      alert("⚠️ Please enter valid numeric values for all metals.");
      return;
    }

    // Calculate H_i for each metal
    const H = {
      lead: values[3] / safeLimits.lead,
      cadmium: values[4] / safeLimits.cadmium,
      iron: values[0] / safeLimits.iron,
      copper: values[1] / safeLimits.copper,
      zinc: values[2] / safeLimits.zinc
    };

    // Calculate HMPI
    let hmpi = 0;
    for (let metal in H) {
      hmpi += H[metal] * weights[metal];
    }

    const hmpiScaled = Number((hmpi * 10).toFixed(2)); // optional scaling for readability

    // Risk classification
    let riskStatus = "";
    let recommendation = "";

    if (hmpiScaled <= 50) {
      riskStatus = "Safe";
      recommendation = "✅ Water is safe to drink.";
    } else if (hmpiScaled <= 70) {
      riskStatus = "Moderate Risk";
      recommendation = "⚠️ Use with caution. Further testing recommended.";
    } else {
      riskStatus = "Unsafe";
      recommendation = "❌ Avoid drinking, water treatment required.";
    }

    setPrediction({ hmpiValue: hmpiScaled, riskStatus, recommendation });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleVisualize = () => {
    navigate("/visualization", { state: { formData, prediction } });
  };

  // ===== Render =====
  return (
    <div className="upload-wrapper">
      <div className="upload-card">
        {/* Form Section */}
        <div className="form-section">
          <h2>Location & HMPI Calculator</h2>
          <form>
            <h3>🌍 Location Details</h3>
            <div className="input-row">
              <label>Select Location:</label>
              <select onChange={handleLocationChange} value={formData.city}>
                <option value="">-- Choose a location --</option>
                {locations.map((loc, index) => (
                  <option key={index} value={loc.city}>
                    {loc.city}, {loc.state}
                  </option>
                ))}
              </select>
            </div>

            {formData.city && (
              <div className="input-row">
                <p>
                  <strong>Selected:</strong> {formData.city}, {formData.state},{" "}
                  {formData.country}
                </p>
              </div>
            )}

            <h3>⚗️ Metal Concentrations</h3>
            {["iron", "copper", "zinc", "lead", "cadmium"].map((metal) => (
              <div className="input-row" key={metal}>
                <label>{metal.charAt(0).toUpperCase() + metal.slice(1)}:</label>
                <input
                  type="number"
                  name={metal}
                  value={formData[metal]}
                  onChange={handleChange}
                  placeholder={`Enter ${metal} (mg/L)`}
                />
              </div>
            ))}

            <button type="button" onClick={handlePredict} className="calc-btn">
              CALCULATE
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="results-section">
          <h2>Results</h2>
          {prediction ? (
            <div className="results-box">
              <div>
                <span className="label">📍 Location</span>
                <p>
                  {formData.city}, {formData.state}, {formData.country}
                </p>
              </div>

              <div>
                <span className="label">HMPI Value</span>
                <span className="value">{prediction.hmpiValue}</span>
              </div>

              <div>
                <span className="label">Risk Status</span>
                <span
                  className="value"
                  style={{
                    color:
                      prediction.riskStatus === "Unsafe"
                        ? "red"
                        : prediction.riskStatus === "Moderate Risk"
                        ? "orange"
                        : "green",
                  }}
                >
                  {prediction.riskStatus}
                </span>
              </div>

              <div>
                <span className="label">Recommendation</span>
                <p>{prediction.recommendation}</p>
              </div>

              <HMPIGauge hmpiValue={prediction.hmpiValue} />

              <button
                onClick={handleVisualize}
                className="calc-btn"
                style={{ marginTop: "15px", background: "#22c55e" }}
              >
                📊 Visualize Data
              </button>
            </div>
          ) : (
            <div className="empty-results">
              <p>Select location + enter values and click Calculate</p>
            </div>
          )}

          {/* File Upload */}
          <div className="file-upload">
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              onClick={handleUploadClick}
              className={`upload-btn ${selectedFile ? "uploaded" : ""}`}
            >
              <FaCloudUploadAlt style={{ marginRight: "8px" }} />
              {selectedFile ? selectedFile.name : "CHOOSE FILE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
