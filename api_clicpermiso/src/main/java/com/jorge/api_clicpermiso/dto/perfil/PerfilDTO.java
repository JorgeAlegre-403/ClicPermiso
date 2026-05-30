package com.jorge.api_clicpermiso.dto.perfil;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PerfilDTO {
    private String id;
    private String nombre;
    private String apellidos;
    private String email;
    private String dni;
    private String rol;
    private String relJuridica;
    private Integer aniosServicio;
    private Boolean haceSustitucion;
    private Boolean consentimientoRgpd;
    private LocalDateTime createdAt;
}