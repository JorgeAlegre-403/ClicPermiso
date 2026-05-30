package com.jorge.api_clicpermiso.controller;

import com.jorge.api_clicpermiso.dto.dashboard.DashboardStatsDTO;
import com.jorge.api_clicpermiso.dto.solicitud.SolicitudDTO;
import com.jorge.api_clicpermiso.repository.PerfilRepository;
import com.jorge.api_clicpermiso.repository.SolicitudRepository;
import com.jorge.api_clicpermiso.service.SolicitudService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasRole('DIRECTIVO')")
@RequiredArgsConstructor
public class DashboardController {

    private final SolicitudRepository solicitudRepository;
    private final PerfilRepository    perfilRepository;
    private final SolicitudService    solicitudService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(new DashboardStatsDTO(
                solicitudRepository.count(),
                solicitudRepository.countByEstado("pendiente"),
                solicitudRepository.countByEstado("aprobada"),
                solicitudRepository.countByEstado("rechazada"),
                perfilRepository.count()
        ));
    }

    @GetMapping("/recientes")
    public ResponseEntity<List<SolicitudDTO>> getRecientes() {
        return ResponseEntity.ok(
                solicitudService.getAllSolicitudes().stream().limit(5).toList());
    }
}