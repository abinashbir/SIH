import React, { useState } from "react";
import "./Filters.css";

const Filters = ({ onFilterChange }) => {
  const [year, setYear] = useState("");
  const [metal, setMetal] = useState("");

  const handleFilterChange = () => {
    onFilterChange({ year, metal });
  };

  return (
    <div className="filters-container">
      <div className="filter">
        <label>Year:</label>
        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            handleFilterChange();
          }}
        >
          <option value="">All</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>

      <div className="filter">
        <label>Metal Type:</label>
        <select
          value={metal}
          onChange={(e) => {
            setMetal(e.target.value);
            handleFilterChange();
          }}
        >
          <option value="">All</option>
          <option value="Lead">Lead</option>
          <option value="Mercury">Mercury</option>
          <option value="Arsenic">Arsenic</option>
          <option value="Cadmium">Cadmium</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
