package com.jorge.api_clicpermiso.dto.solicitud;

import lombok.Data;

@Data
public class SolicitudUpdateEstadoDTO {
    private String estado;
    private String motivoRechazo;
}