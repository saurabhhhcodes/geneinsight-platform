package com.geneinsight.service;

import com.geneinsight.entity.User;
import com.geneinsight.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User updateUser(Long id, User userUpdate) {
        User user = getUserById(id);

        if (userUpdate.getFirstName() != null) {
            user.setFirstName(userUpdate.getFirstName());
        }
        if (userUpdate.getLastName() != null) {
            user.setLastName(userUpdate.getLastName());
        }
        if (userUpdate.getEmail() != null) {
            user.setEmail(userUpdate.getEmail());
        }
        if (userUpdate.getRole() != null) {
            user.setRole(userUpdate.getRole());
        }
        if (userUpdate.getIsActive() != null) {
            user.setIsActive(userUpdate.getIsActive());
        }

        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
    
    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.findActiveUsers().size());
        stats.put("researcherUsers", userRepository.countByRole(User.UserRole.RESEARCHER));
        return stats;
    }
}
