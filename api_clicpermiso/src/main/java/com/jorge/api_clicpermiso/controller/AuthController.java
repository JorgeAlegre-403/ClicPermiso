package com.jorge.api_clicpermiso.controller;

import com.jorge.api_clicpermiso.dto.auth.LoginRequestDTO;
import com.jorge.api_clicpermiso.dto.auth.LoginResponseDTO;
import com.jorge.api_clicpermiso.dto.auth.SignUpRequestDTO;
import com.jorge.api_clicpermiso.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        try {
            LoginResponseDTO response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignUpRequestDTO request) {
        try {
            LoginResponseDTO response = authService.signup(request);
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error al registrarse: " + e.getMessage());
        }
    }
}