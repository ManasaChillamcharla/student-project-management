import React, { useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function ProjectForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    department: "",
    abstractText: "",
    githubLink: "",
    frontendIp: "",
    backendIp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", formData); // keep your old endpoint if different
      alert("Project submitted successfully!");
      setFormData({
        name: "",
        rollNumber: "",
        department: "",
        abstractText: "",
        githubLink: "",
        frontendIp: "",
        backendIp: "",
      });
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Failed to submit project");
    }
  };

  return (
    <div className="page-container">
      <div className="main-card">
        <h1 className="page-title">Student Project Submission Form</h1>
        <p className="page-subtitle">
          
        </p>

        <div className="form-section">
          <h2 className="section-title">Project Details</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <TextField
                label="Student Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                  },
                }}
              />

              <TextField
                label="Roll Number"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                fullWidth
                variant="outlined"
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
                name="department"
                value={formData.department}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                  },
                }}
              >
                <MenuItem value="">Select Department</MenuItem>
                <MenuItem value="CSE">CSE</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="DS">DS</MenuItem>
                <MenuItem value="AIML">AIML</MenuItem>
                <MenuItem value="ECE">ECE</MenuItem>
                <MenuItem value="EEE">EEE</MenuItem>
                <MenuItem value="MECH">MECH</MenuItem>
                <MenuItem value="CIVIL">CIVIL</MenuItem>
              </TextField>

              <div className="full-width">
                <TextField
                  label="Abstract"
                  name="abstractText"
                  value={formData.abstractText}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      alignItems: "flex-start",
                    },
                  }}
                />
              </div>

              <TextField
                label="GitHub Link"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                  },
                }}
              />

              <TextField
                label="Frontend IP"
                name="frontendIp"
                value={formData.frontendIp}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                  },
                }}
              />

              <TextField
                label="Backend IP"
                name="backendIp"
                value={formData.backendIp}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                  },
                }}
              />
            </div>

            <div className="button-row">
              <Button type="submit" className="primary-btn">
                Submit Project
              </Button>

              <Button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/dashboard")}
              >
                View Dashboard
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProjectForm;
