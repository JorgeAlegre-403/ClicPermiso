package com.jorge.api_clicpermiso.dto.perfil;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PerfilResumenDTO {
    private String nombre;
    private String apellidos;
    private String email;
    private String dni;
}