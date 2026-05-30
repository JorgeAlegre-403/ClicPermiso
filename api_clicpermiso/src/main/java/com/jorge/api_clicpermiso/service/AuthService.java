package com.jorge.api_clicpermiso.service;

import com.jorge.api_clicpermiso.dto.auth.LoginRequestDTO;
import com.jorge.api_clicpermiso.dto.auth.LoginResponseDTO;
import com.jorge.api_clicpermiso.dto.auth.SignUpRequestDTO;
import com.jorge.api_clicpermiso.model.Perfil;
import com.jorge.api_clicpermiso.repository.PerfilRepository;
import com.jorge.api_clicpermiso.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PerfilRepository perfilRepository;
    private final PasswordEncoder  passwordEncoder;
    private final JwtUtil          jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO request) {
        System.out.println("DEBUG: Intento de login con email: [" + request.getEmail() + "]");

        Perfil perfil = perfilRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    System.out.println("DEBUG: ERROR - Usuario NO encontrado: [" + request.getEmail() + "]");
                    return new BadCredentialsException("Credenciales incorrectas");
                });

        if (!passwordEncoder.matches(request.getPassword(), perfil.getPassword())) {
            System.out.println("DEBUG: ERROR - La contraseña no coincide para: " + request.getEmail());
            throw new BadCredentialsException("Credenciales incorrectas");
        }

        System.out.println("DEBUG: LOGIN EXITOSO para: " + request.getEmail());

        String token = jwtUtil.generateToken(
                perfil.getId(), perfil.getEmail(), perfil.getRol());

        return new LoginResponseDTO(
                token,
                perfil.getId(),
                perfil.getRol(),
                perfil.getNombre(),
                perfil.getApellidos(),
                perfil.getEmail()
        );
    }

    public LoginResponseDTO signup(SignUpRequestDTO request) {
        System.out.println("DEBUG: Intento de registro con email: [" + request.getEmail() + "]");

        // Verificar si el email ya existe
        if (perfilRepository.findByEmail(request.getEmail()).isPresent()) {
            System.out.println("DEBUG: ERROR - El email ya está registrado: [" + request.getEmail() + "]");
            throw new BadCredentialsException("El email ya está registrado");
        }

        // Crear nuevo perfil
        Perfil perfil = new Perfil();
        perfil.setNombre(request.getNombre());
        perfil.setApellidos(request.getApellidos());
        perfil.setEmail(request.getEmail());
        perfil.setPassword(passwordEncoder.encode(request.getPassword())); // Encriptar contraseña
        perfil.setDni(request.getDni());
        perfil.setRol(request.getRol() != null ? request.getRol() : "docente");

        Perfil perfilGuardado = perfilRepository.save(perfil);

        System.out.println("DEBUG: REGISTRO EXITOSO para: " + request.getEmail());

        String token = jwtUtil.generateToken(
                perfilGuardado.getId(), perfilGuardado.getEmail(), perfilGuardado.getRol());

        return new LoginResponseDTO(
                token,
                perfilGuardado.getId(),
                perfilGuardado.getRol(),
                perfilGuardado.getNombre(),
                perfilGuardado.getApellidos(),
                perfilGuardado.getEmail()
        );
    }
}