package com.geneinsight.controller;

import com.geneinsight.entity.User;
import com.geneinsight.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Boolean isActive) {
        try {
            User user = adminService.getUserById(id);
            user.setIsActive(isActive);
            return ResponseEntity.ok(adminService.updateUser(id, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/model/train")
    public ResponseEntity<?> trainModel(
            @RequestParam("file") MultipartFile trainingData,
            @RequestParam("modelName") String modelName,
            @RequestParam(required = false) String description) {
        return ResponseEntity.ok("Model training functionality not implemented yet");
    }

    @GetMapping("/model/metrics")
    public ResponseEntity<?> getModelMetrics() {
        return ResponseEntity.ok("Model metrics functionality not implemented yet");
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(
            @RequestParam(required = false) String period) {
        return ResponseEntity.ok("Analytics functionality not implemented yet");
    }

    @GetMapping("/system/health")
    public ResponseEntity<?> getSystemHealth() {
        return ResponseEntity.ok("System health functionality not implemented yet");
    }

    @GetMapping("/system/logs")
    public ResponseEntity<?> getSystemLogs(
            @RequestParam(defaultValue = "100") int limit,
            @RequestParam(required = false) String level) {
        return ResponseEntity.ok("System logs functionality not implemented yet");
    }
}
