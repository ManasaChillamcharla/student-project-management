import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProjectForm from "./components/ProjectForm";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
