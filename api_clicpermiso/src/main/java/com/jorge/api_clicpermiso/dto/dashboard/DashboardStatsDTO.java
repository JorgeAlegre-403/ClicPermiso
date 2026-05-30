package com.jorge.api_clicpermiso.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
    private long total;
    private long pendientes;
    private long aprobadas;
    private long rechazadas;
    private long profesores;
}