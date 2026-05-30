package com.jorge.api_clicpermiso.dto.perfil;

import lombok.Data;

@Data
public class PerfilUpdateDTO {
    private String nombre;
    private String apellidos;
    private String dni;
    private String relJuridica;
    private Integer aniosServicio;
    private Boolean haceSustitucion;
}