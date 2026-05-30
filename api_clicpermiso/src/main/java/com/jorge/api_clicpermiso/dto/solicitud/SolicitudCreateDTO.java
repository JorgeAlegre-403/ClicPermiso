package com.jorge.api_clicpermiso.dto.solicitud;

import lombok.Data;

import java.time.LocalDate;

@Data
public class SolicitudCreateDTO {
    private LocalDate diaSolicitado;
    private String telefono;
    private String turno;
    private String jornada;
    private Integer numHoras;
    private Integer numDias;
    private Boolean permisoNoRetribuido;
    private String motivo;
}