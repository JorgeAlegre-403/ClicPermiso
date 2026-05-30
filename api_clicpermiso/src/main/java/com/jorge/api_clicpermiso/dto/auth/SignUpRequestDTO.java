package com.jorge.api_clicpermiso.dto.auth;

import lombok.Data;

@Data
public class SignUpRequestDTO {
    private String nombre;
    private String apellidos;
    private String email;
    private String password;
    private String dni;
    private String rol = "docente"; // por defecto será docente
}
