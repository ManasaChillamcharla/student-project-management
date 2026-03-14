package com.example.studentproject;

import org.springframework.web.bind.annotation.GetMapping;

public class Index {
    @GetMapping("/")
    public String m1() {
        return "Welcome to the Student Project API!";
    }
}
