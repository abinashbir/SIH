import React from "react";
import "./SummaryCards.css";
import { FaVial, FaExclamationTriangle, FaShieldAlt, FaClock } from "react-icons/fa";
import CountUp from "react-countup";

const SummaryCards = ({ totalSamples, highRiskAreas, safePercent, lastUpdated }) => {
  return (
    <div className="summary-cards">
      {/* Total Samples */}
      <div className="summary-card">
        <div className="icon-box samples">
          <FaVial />
        </div>
        <div>
          <h3 className="number-highlight">
            <CountUp end={totalSamples} duration={2} separator="," />
          </h3>
          <p>Total Samples</p>
        </div>
      </div>

      {/* High Risk Areas */}
      <div className="summary-card">
        <div className="icon-box risk">
          <FaExclamationTriangle />
        </div>
        <div>
          <h3 className="number-highlight danger">
            <CountUp end={highRiskAreas} duration={2} />
          </h3>
          <p>High Risk Areas</p>
        </div>
      </div>

      {/* Safe Percentage */}
      <div className="summary-card">
        <div className="icon-box safe">
          <FaShieldAlt />
        </div>
        <div>
          <h3 className="number-highlight success">
            <CountUp end={safePercent} duration={2} />%
          </h3>
          <p>Safe Zones</p>
        </div>
      </div>

      {/* Last Updated */}
      <div className="summary-card">
        <div className="icon-box updated">
          <FaClock />
        </div>
        <div>
          <h3 className="number-highlight subtle">{lastUpdated}</h3>
          <p>Last Updated</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
