package com.example.myfinances.controller;

import com.example.myfinances.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.myfinances.DTO.AuthResponse;
import com.example.myfinances.DTO.AuthRequest;



@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final com.example.myfinances.service.UserService userService;
    private final com.example.myfinances.security.JwtUtil jwtUtil;

    public AuthController(com.example.myfinances.service.UserService userService, com.example.myfinances.security.JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {
            userService.register(user);
        }catch (RuntimeException e) {
            return ResponseEntity.status(400).body("user already exists");
        }

        return ResponseEntity.ok("registration successful");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        return userService.authenticate(request.getEmail(), request.getPassword())
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getEmail());
                    return ResponseEntity.ok(new AuthResponse(token));
                })
                .orElseGet(() -> ResponseEntity
                .status(401)
                .body(new AuthResponse("")));
    }

}
