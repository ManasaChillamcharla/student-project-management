import React, { useEffect, useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import API from "../services/api";

const formatUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    rollNumber: "",
    department: "",
    abstractText: "",
    githubLink: "",
    frontendIp: "",
    backendIp: "",
  });
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

  const handleEditClick = (project) => {
    setEditingId(project.id);
    setEditData({
      name: project.name || "",
      rollNumber: project.rollNumber || "",
      department: project.department || "",
      abstractText: project.abstractText || "",
      githubLink: project.githubLink || "",
      frontendIp: project.frontendIp || "",
      backendIp: project.backendIp || "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(`/projects/${id}`, {
        ...editData,
        githubLink: formatUrl(editData.githubLink),
      });
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this project?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
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
    const worksheet = XLSX.utils.json_to_sheet(
      filteredProjects.map((project) => ({
        ...project,
        githubLink: formatUrl(project.githubLink),
      }))
    );
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
        project.githubLink ? "Open Link" : "-",
        project.frontendIp || "",
        project.backendIp || "",
      ]),
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [30, 41, 59],
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 5) {
          const project = filteredProjects[data.row.index];
          const url = formatUrl(project.githubLink);

          if (project.githubLink && url) {
            doc.link(
              data.cell.x,
              data.cell.y,
              data.cell.width,
              data.cell.height,
              { url }
            );
          }
        }
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <tr key={project.id || index}>
                    {editingId === project.id ? (
                      <>
                        <td>{project.id}</td>
                        <td>
                          <TextField
                            size="small"
                            value={editData.name}
                            onChange={(e) =>
                              setEditData({ ...editData, name: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <TextField
                            size="small"
                            value={editData.rollNumber}
                            onChange={(e) =>
                              setEditData({ ...editData, rollNumber: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <TextField
                            select
                            size="small"
                            value={editData.department}
                            onChange={(e) =>
                              setEditData({ ...editData, department: e.target.value })
                            }
                            sx={{ minWidth: 120 }}
                          >
                            <MenuItem value="CSE">CSE</MenuItem>
                            <MenuItem value="IT">IT</MenuItem>
                            <MenuItem value="DS">DS</MenuItem>
                            <MenuItem value="AIML">AIML</MenuItem>
                            <MenuItem value="ECE">ECE</MenuItem>
                            <MenuItem value="EEE">EEE</MenuItem>
                            <MenuItem value="MECH">MECH</MenuItem>
                            <MenuItem value="CIVIL">CIVIL</MenuItem>
                          </TextField>
                        </td>
                        <td>
                          <TextField
                            size="small"
                            value={editData.abstractText}
                            onChange={(e) =>
                              setEditData({ ...editData, abstractText: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <TextField
                            size="small"
                            value={editData.githubLink}
                            onChange={(e) =>
                              setEditData({ ...editData, githubLink: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <TextField
                            size="small"
                            value={editData.frontendIp}
                            onChange={(e) =>
                              setEditData({ ...editData, frontendIp: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <TextField
                            size="small"
                            value={editData.backendIp}
                            onChange={(e) =>
                              setEditData({ ...editData, backendIp: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleUpdate(project.id)}
                            sx={{ mr: 1, mb: 1 }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </td>
                      </>
                    ) : (
                      <>
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
                              href={formatUrl(project.githubLink)}
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
                        <td>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleEditClick(project)}
                            sx={{ mr: 1, mb: 1 }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(project.id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="empty-state">
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