package com.example.studentproject.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.studentproject.entity.Project;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
}