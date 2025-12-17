import React, { useState } from "react";
import HMPIGauge from "../components/HMPIGauge";
import "./HMPIForm.css"; // ✅ make sure this file exists

function HMPIForm() {
  const [formData, setFormData] = useState({
    lead: "",
    cadmium: "",
    iron: "",
    copper: "",
    zinc: "",
  });

  const [result, setResult] = useState(null);

  // ✅ Safe limits (mg/L)
  const safeLimits = {
    lead: 0.01,
    cadmium: 0.003,
    iron: 0.3,
    copper: 1,
    zinc: 5,
  };

  // ✅ Weights
  const weights = {
    lead: 0.25,
    cadmium: 0.25,
    iron: 0.2,
    copper: 0.15,
    zinc: 0.15,
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ HMPI Calculation
  const handleCalculate = () => {
    const metals = Object.keys(formData);
    const values = metals.map((m) => Number(formData[m]));

    // Validation: no empty or negative values
    if (values.some((val) => isNaN(val) || val < 0)) {
      alert("⚠️ Please enter valid (non-negative) numeric values for all metals.");
      return;
    }

    // Sub-index for each metal
    const H = {};
    metals.forEach((metal, i) => {
      H[metal] = safeLimits[metal] > 0 ? values[i] / safeLimits[metal] : 0;
    });

    // Weighted sum
    let hmpi = 0;
    for (let metal of metals) {
      hmpi += H[metal] * weights[metal];
    }

    const hmpiScaled = Number((hmpi * 10).toFixed(2));

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

    setResult({ hmpiValue: hmpiScaled, riskStatus, recommendation });
  };

  return (
    <div className="hmpi-form-container">
      <h2>⚗️ HMPI Calculator</h2>
      <p>Enter concentrations of heavy metals (mg/L)</p>

      {/* Input fields */}
      {Object.keys(formData).map((metal) => (
        <div className="input-row" key={metal}>
          <label htmlFor={metal}>
            {metal.charAt(0).toUpperCase() + metal.slice(1)}:
          </label>
          <input
            id={metal}
            type="number"
            name={metal}
            value={formData[metal]}
            onChange={handleChange}
            placeholder={`Enter ${metal} (mg/L)`}
            step="0.001"
            min="0"
            required
          />
        </div>
      ))}

      <button className="calc-btn" onClick={handleCalculate}>
        CALCULATE HMPI
      </button>

      {/* Results Section */}
      {result && (
        <div className="results">
          <h3>Results</h3>
          <p>
            <strong>HMPI Value:</strong> {result.hmpiValue}
          </p>
          <p>
            <strong>Risk Status:</strong>{" "}
            <span
              style={{
                color:
                  result.riskStatus === "Unsafe"
                    ? "red"
                    : result.riskStatus === "Moderate Risk"
                    ? "orange"
                    : "green",
              }}
            >
              {result.riskStatus}
            </span>
          </p>
          <p>{result.recommendation}</p>

          {/* Gauge Visualization */}
          <HMPIGauge hmpiValue={result.hmpiValue} />
        </div>
      )}
    </div>
  );
}

export default HMPIForm;
