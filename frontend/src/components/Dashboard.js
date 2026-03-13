import React, { useEffect, useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import API from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await API.get("/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const text = searchText.toLowerCase();

    const matchesSearch =
      project.name?.toLowerCase().includes(text) ||
      project.rollNumber?.toLowerCase().includes(text) ||
      project.githubLink?.toLowerCase().includes(text);

    const matchesDepartment =
      departmentFilter === "" || project.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProjects);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
    XLSX.writeFile(workbook, "student_projects.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text("Submitted Projects Table", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [[
        "ID",
        "Name",
        "Roll Number",
        "Department",
        "Abstract",
        "GitHub Link",
        "Frontend IP",
        "Backend IP",
      ]],
      body: filteredProjects.map((project) => [
        project.id || "",
        project.name || "",
        project.rollNumber || "",
        project.department || "",
        project.abstractText || "",
        project.githubLink || "",
        project.frontendIp || "",
        project.backendIp || "",
      ]),
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [30, 41, 59],
      },
    });

    doc.save("student_projects.pdf");
  };

  return (
    <div className="page-container">
      <div className="main-card">
        <h1 className="page-title">Submitted Projects</h1>
        <p className="page-subtitle">
          View, search, filter, and export all submitted student project details
        </p>

        <div className="dashboard-section">
          <div className="button-row">
            <Button
              className="secondary-btn"
              onClick={() => navigate("/")}
            >
              Back to Form
            </Button>

            <Button
              className="primary-btn"
              onClick={exportToExcel}
            >
              Export to Excel
            </Button>

            <Button
              className="secondary-btn"
              onClick={exportToPDF}
            >
              Export to PDF
            </Button>
          </div>
        </div>

        <div className="filter-section">
          <h2 className="section-title">Search & Filter</h2>

          <div className="filter-bar">
            <TextField
              label="Search by Name, Roll Number, GitHub"
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                },
              }}
            />

            <TextField
              select
              label="Department"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              sx={{
                minWidth: 220,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                },
              }}
            >
              <MenuItem value="">All Departments</MenuItem>
              <MenuItem value="CSE">CSE</MenuItem>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="DS">DS</MenuItem>
              <MenuItem value="AIML">AIML</MenuItem>
              <MenuItem value="ECE">ECE</MenuItem>
              <MenuItem value="EEE">EEE</MenuItem>
              <MenuItem value="MECH">MECH</MenuItem>
              <MenuItem value="CIVIL">CIVIL</MenuItem>
            </TextField>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Abstract</th>
                <th>GitHub Link</th>
                <th>Frontend IP</th>
                <th>Backend IP</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <tr key={project.id || index}>
                    <td>{project.id}</td>
                    <td>{project.name}</td>
                    <td>
                      <span className="badge">
                        {project.rollNumber}
                      </span>
                    </td>
                    <td>{project.department}</td>
                    <td>
                      {project.abstractText && project.abstractText.length > 80
                        ? project.abstractText.substring(0, 80) + "..."
                        : project.abstractText}
                    </td>
                    <td>
                      {project.githubLink ? (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="link-text"
                        >
                          Open Link
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{project.frontendIp || "-"}</td>
                    <td>{project.backendIp || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
