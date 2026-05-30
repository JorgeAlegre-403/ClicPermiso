package com.jorge.api_clicpermiso.controller;

import com.jorge.api_clicpermiso.dto.solicitud.SolicitudCreateDTO;
import com.jorge.api_clicpermiso.dto.solicitud.SolicitudDTO;
import com.jorge.api_clicpermiso.dto.solicitud.SolicitudUpdateEstadoDTO;
import com.jorge.api_clicpermiso.service.FileStorageService;
import com.jorge.api_clicpermiso.service.SolicitudService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
public class SolicitudController {

    private final SolicitudService  solicitudService;
    private final FileStorageService fileStorageService;

    /** Docente: sus propias solicitudes */
    @GetMapping("/mis-solicitudes")
    public ResponseEntity<List<SolicitudDTO>> getMisSolicitudes(Authentication auth) {
        return ResponseEntity.ok(solicitudService.getMisSolicitudes(auth.getName()));
    }

    /** Directivo: todas las solicitudes */
    @PreAuthorize("hasRole('DIRECTIVO')")
    @GetMapping
    public ResponseEntity<List<SolicitudDTO>> getAllSolicitudes() {
        return ResponseEntity.ok(solicitudService.getAllSolicitudes());
    }

    /** Directivo: solicitudes del calendario por mes */
    @PreAuthorize("hasRole('DIRECTIVO')")
    @GetMapping("/calendario")
    public ResponseEntity<List<SolicitudDTO>> getCalendario(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(
                solicitudService.getSolicitudesByCalendario(year, month));
    }

    /** Docente: crear solicitud (con archivo opcional) */
    @PostMapping(path = "/crear", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SolicitudDTO> create(
            Authentication auth,
            @RequestPart("solicitud") SolicitudCreateDTO dto,
            @RequestPart(value = "archivo", required = false) MultipartFile archivo) {

        String archivoUrl = null;
        if (archivo != null && !archivo.isEmpty()) {
            try {
                archivoUrl = fileStorageService.storeFile(archivo);
            } catch (Exception e) {
                // Continúa sin archivo
            }
        }

        return ResponseEntity.ok(
                solicitudService.createSolicitud(auth.getName(), dto, archivoUrl));
    }

    /** Directivo: aprobar o rechazar */
    @PreAuthorize("hasRole('DIRECTIVO')")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<SolicitudDTO> updateEstado(
            @PathVariable Long id,
            @RequestBody SolicitudUpdateEstadoDTO dto) {
        return ResponseEntity.ok(solicitudService.updateEstado(id, dto));
    }
}