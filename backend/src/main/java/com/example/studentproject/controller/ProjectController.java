package com.example.studentproject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.studentproject.entity.Project;
import com.example.studentproject.repository.ProjectRepository;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    // Save project
    @PostMapping
    public Project saveProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    // Get all projects
    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    // Update project (EDIT)
    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setName(updatedProject.getName());
        project.setRollNumber(updatedProject.getRollNumber());
        project.setDepartment(updatedProject.getDepartment());
        project.setAbstractText(updatedProject.getAbstractText());
        project.setGithubLink(updatedProject.getGithubLink());
        project.setFrontendIp(updatedProject.getFrontendIp());
        project.setBackendIp(updatedProject.getBackendIp());

        return projectRepository.save(project);
    }

    // Delete project
    @DeleteMapping("/{id}")
    public String deleteProject(@PathVariable Long id) {
        projectRepository.deleteById(id);
        return "Project deleted successfully";
    }
}