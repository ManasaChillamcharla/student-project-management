package com.example.studentproject;

import org.springframework.web.bind.annotation.GetMapping;

public class index {
    @GetMapping("/")
    public String m1() {
        return "Welcome to the Student Project API!";
    }
}
