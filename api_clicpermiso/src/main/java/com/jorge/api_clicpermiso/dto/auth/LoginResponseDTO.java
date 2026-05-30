package com.jorge.api_clicpermiso.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String id;
    private String rol;
    private String nombre;
    private String apellidos;
    private String email;
}