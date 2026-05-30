package com.jorge.api_clicpermiso.dto.solicitud;

import com.jorge.api_clicpermiso.dto.perfil.PerfilResumenDTO;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class SolicitudDTO {
    private Long id;
    private String usuarioId;
    private LocalDate diaSolicitado;
    private String telefono;
    private String turno;
    private String jornada;
    private Integer numHoras;
    private Integer numDias;
    private Boolean permisoNoRetribuido;
    private String motivo;
    private String archivoAdjunto;
    private String estado;
    private String motivoRechazo;
    private LocalDateTime createdAt;
    private PerfilResumenDTO perfiles;
}