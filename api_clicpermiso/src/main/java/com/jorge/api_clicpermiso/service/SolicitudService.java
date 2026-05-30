package com.jorge.api_clicpermiso.service;

import com.jorge.api_clicpermiso.dto.perfil.PerfilResumenDTO;
import com.jorge.api_clicpermiso.dto.solicitud.SolicitudCreateDTO;
import com.jorge.api_clicpermiso.dto.solicitud.SolicitudDTO;
import com.jorge.api_clicpermiso.dto.solicitud.SolicitudUpdateEstadoDTO;
import com.jorge.api_clicpermiso.model.Perfil;
import com.jorge.api_clicpermiso.model.Solicitud;
import com.jorge.api_clicpermiso.repository.PerfilRepository;
import com.jorge.api_clicpermiso.repository.SolicitudRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final PerfilRepository    perfilRepository;

    @Transactional
    public SolicitudDTO createSolicitud(String userId,
                                        SolicitudCreateDTO dto,
                                        String archivoUrl) {
        Perfil perfil = perfilRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Solicitud solicitud = new Solicitud();
        solicitud.setPerfil(perfil);
        solicitud.setDiaSolicitado(dto.getDiaSolicitado());
        solicitud.setTelefono(dto.getTelefono());
        solicitud.setTurno(dto.getTurno());
        solicitud.setJornada(dto.getJornada());
        solicitud.setNumHoras(dto.getNumHoras());
        solicitud.setNumDias(dto.getNumDias());
        solicitud.setPermisoNoRetribuido(
                dto.getPermisoNoRetribuido() != null && dto.getPermisoNoRetribuido());
        solicitud.setMotivo(dto.getMotivo());
        solicitud.setArchivoAdjunto(archivoUrl);
        solicitud.setEstado("pendiente");

        return toDTO(solicitudRepository.save(solicitud));
    }

    @Transactional(readOnly = true)
    public List<SolicitudDTO> getMisSolicitudes(String userId) {
        return solicitudRepository
                .findByPerfilIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitudDTO> getAllSolicitudes() {
        return solicitudRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitudDTO> getSolicitudesByCalendario(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end   = start.withDayOfMonth(start.lengthOfMonth());
        return solicitudRepository
                .findByCalendario(start, end)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public SolicitudDTO updateEstado(Long id, SolicitudUpdateEstadoDTO dto) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        solicitud.setEstado(dto.getEstado());
        if (dto.getMotivoRechazo() != null && !dto.getMotivoRechazo().isBlank()) {
            solicitud.setMotivoRechazo(dto.getMotivoRechazo());
        }

        return toDTO(solicitudRepository.save(solicitud));
    }

    public SolicitudDTO toDTO(Solicitud s) {
        SolicitudDTO dto = new SolicitudDTO();
        dto.setId(s.getId());
        dto.setUsuarioId(s.getPerfil().getId());
        dto.setDiaSolicitado(s.getDiaSolicitado());
        dto.setTelefono(s.getTelefono());
        dto.setTurno(s.getTurno());
        dto.setJornada(s.getJornada());
        dto.setNumHoras(s.getNumHoras());
        dto.setNumDias(s.getNumDias());
        dto.setPermisoNoRetribuido(s.getPermisoNoRetribuido());
        dto.setMotivo(s.getMotivo());
        dto.setArchivoAdjunto(s.getArchivoAdjunto());
        dto.setEstado(s.getEstado());
        dto.setMotivoRechazo(s.getMotivoRechazo());
        dto.setCreatedAt(s.getCreatedAt());

        Perfil p = s.getPerfil();
        dto.setPerfiles(new PerfilResumenDTO(
                p.getNombre(), p.getApellidos(), p.getEmail(), p.getDni()));

        return dto;
    }
}