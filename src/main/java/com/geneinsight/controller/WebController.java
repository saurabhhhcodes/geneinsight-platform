package com.geneinsight.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebController {

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("GeneInsight Platform is running!");
    }

    @GetMapping("/analyze")
    public String analyze() {
        return "index.html";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "index.html";
    }

    @GetMapping("/admin")
    public String admin() {
        return "index.html";
    }

    @GetMapping("/login")
    public String login() {
        return "index.html";
    }

    @GetMapping("/register")
    public String register() {
        return "index.html";
    }
}
