// src/pages/Reports.jsx
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import './Reports.css';

// Default line chart data (monthly trends)
const defaultLineData = [
  { name: 'Jan', Lead: 12, Cadmium: 3, Zinc: 8, Copper: 5 },
  { name: 'Feb', Lead: 10, Cadmium: 2, Zinc: 7, Copper: 4 },
  { name: 'Mar', Lead: 8, Cadmium: 1, Zinc: 5, Copper: 3 },
  { name: 'Apr', Lead: 15, Cadmium: 4, Zinc: 9, Copper: 6 },
  { name: 'May', Lead: 9, Cadmium: 2, Zinc: 6, Copper: 4 },
  { name: 'Jun', Lead: 11, Cadmium: 3, Zinc: 7, Copper: 5 },
  { name: 'Jul', Lead: 14, Cadmium: 4, Zinc: 8, Copper: 6 },
];

// Default pie chart data
const defaultPieData = [
  { name: 'Lead', value: 60 },
  { name: 'Cadmium', value: 20 },
  { name: 'Zinc', value: 30 },
  { name: 'Copper', value: 25 },
];

const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = () => {
  // ================= Filters =================
  const [filters, setFilters] = useState({
    timeRange: '',
    location: '',
    metalType: 'Lead',
    riskCategory: '',
  });

  // ================= Data =================
  const [lineData, setLineData] = useState(defaultLineData);
  const [pieData, setPieData] = useState(defaultPieData);
  const [tableData, setTableData] = useState([
    {
      location: 'Ranchi',
      hmpi: 72,
      risk: 'High',
      metals: { Lead: 12, Cadmium: 3, Zinc: 8, Copper: 5 },
    },
    {
      location: 'Delhi',
      hmpi: 45,
      risk: 'Medium',
      metals: { Lead: 6, Cadmium: 2, Zinc: 5, Copper: 3 },
    },
    {
      location: 'Mumbai',
      hmpi: 20,
      risk: 'Low',
      metals: { Lead: 2, Cadmium: 1, Zinc: 3, Copper: 2 },
    },
  ]);

  // ================= Dynamic filter options =================
  const options = {
    timeRange: ['2023', '2024', '2025'],
    location: ['Ranchi', 'Delhi', 'Mumbai'],
    metalType: ['Lead', 'Cadmium', 'Zinc', 'Copper'],
    riskCategory: ['Low', 'Medium', 'High', 'Very High'],
  };

  // ================= Handlers =================
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    // Update line chart dynamically based on selected metal
    if (name === 'metalType') {
      const newLine = defaultLineData.map((item) => ({
        name: item.name,
        value: item[value],
      }));
      setLineData(newLine);

      // Update pie chart for distribution
      const newPie = defaultPieData.map((item) => ({
        ...item,
        value: item.name === value ? 100 : 0,
      }));
      setPieData(newPie);
    }
  };

  const resetFilters = () => {
    setFilters({ timeRange: '', location: '', metalType: 'Lead', riskCategory: '' });
    setLineData(defaultLineData.map((item) => ({ name: item.name, value: item.Lead })));
    setPieData(defaultPieData);
    setTableData([
      {
        location: 'Ranchi',
        hmpi: 72,
        risk: 'High',
        metals: { Lead: 12, Cadmium: 3, Zinc: 8, Copper: 5 },
      },
      {
        location: 'Delhi',
        hmpi: 45,
        risk: 'Medium',
        metals: { Lead: 6, Cadmium: 2, Zinc: 5, Copper: 3 },
      },
      {
        location: 'Mumbai',
        hmpi: 20,
        risk: 'Low',
        metals: { Lead: 2, Cadmium: 1, Zinc: 3, Copper: 2 },
      },
    ]);
  };

  const generateReport = () => {
    // Filter table data based on filters
    const filteredTable = tableData
      .map((item) => {
        if (filters.location && item.location !== filters.location) return null;
        if (filters.riskCategory && item.risk !== filters.riskCategory) return null;
        return item;
      })
      .filter(Boolean);

    setTableData(filteredTable);

    // Dummy chart update (random values for demo)
    const newLine = defaultLineData.map((item) => ({
      name: item.name,
      value: Math.floor(Math.random() * 50) + 1,
    }));
    setLineData(newLine);

    const newPie = defaultPieData.map((item) => ({
      ...item,
      value: Math.floor(Math.random() * 50) + 1,
    }));
    setPieData(newPie);
  };

  // ================= Export functions =================
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Generated Report', 20, 20);
    doc.save('report.pdf');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      tableData.map((t) => ({
        Location: t.location,
        HMPI: t.hmpi,
        Risk: t.risk,
        Lead: t.metals.Lead,
        Cadmium: t.metals.Cadmium,
        Zinc: t.metals.Zinc,
        Copper: t.metals.Copper,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'report.xlsx');
  };

  // ================= Render =================
  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1>Reports Dashboard</h1>
        <span className="report-date">{new Date().toLocaleDateString()}</span>
      </div>

      <div className="reports-content">
        {/* Filters */}
        <div className="reports-filters card">
          <h2>Filters</h2>
          {Object.keys(filters).map((field) => (
            <div className="filter-group" key={field}>
              <label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <select
                name={field}
                id={field}
                value={filters[field]}
                onChange={handleFilterChange}
              >
                <option value="">Select</option>
                {options[field].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="filter-buttons">
            <button className="btn generate-btn" onClick={generateReport}>
              Generate
            </button>
            <button className="btn reset-btn" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>

        {/* Charts & Table */}
        <div className="reports-main">
          {/* Charts */}
          <div className="summary-charts">
            <div className="chart-card card">
              <h3>Monthly Trends ({filters.metalType})</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card card">
              <h3>Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="summary-table card">
            <h3>Location-wise Status</h3>
            <table>
              <thead>
                <tr>
                  <th>Location</th>
                  <th>HMPI</th>
                  <th>Risk</th>
                  <th>Metal Values</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.location}</td>
                    <td>{item.hmpi}</td>
                    <td>
                      <span className={`badge ${item.risk.toLowerCase()}-risk`}>
                        {item.risk}
                      </span>
                    </td>
                    <td>
                      Lead: {item.metals.Lead}, Cadmium: {item.metals.Cadmium}, Zinc: {item.metals.Zinc}, Copper: {item.metals.Copper}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="export-buttons">
              <button className="btn pdf-btn" onClick={exportPDF}>
                📄 PDF
              </button>
              <button className="btn excel-btn" onClick={exportExcel}>
                📊 Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
