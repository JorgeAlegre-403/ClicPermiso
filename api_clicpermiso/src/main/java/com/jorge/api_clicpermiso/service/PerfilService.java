package com.jorge.api_clicpermiso.service;

import com.jorge.api_clicpermiso.dto.perfil.PerfilDTO;
import com.jorge.api_clicpermiso.dto.perfil.PerfilUpdateDTO;
import com.jorge.api_clicpermiso.model.Perfil;
import com.jorge.api_clicpermiso.repository.PerfilRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerfilService {

    private final PerfilRepository perfilRepository;

    @Transactional(readOnly = true)
    public PerfilDTO getPerfilById(String id) {
        Perfil perfil = perfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
        return toDTO(perfil);
    }

    @Transactional(readOnly = true)
    public List<PerfilDTO> getAllPerfiles() {
        return perfilRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public PerfilDTO updatePerfil(String id, PerfilUpdateDTO dto) {
        Perfil perfil = perfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));

        if (dto.getNombre()         != null) perfil.setNombre(dto.getNombre());
        if (dto.getApellidos()      != null) perfil.setApellidos(dto.getApellidos());
        if (dto.getDni()            != null) perfil.setDni(dto.getDni());
        if (dto.getRelJuridica()    != null) perfil.setRelJuridica(dto.getRelJuridica());
        if (dto.getAniosServicio()  != null) perfil.setAniosServicio(dto.getAniosServicio());
        if (dto.getHaceSustitucion()!= null) perfil.setHaceSustitucion(dto.getHaceSustitucion());

        return toDTO(perfilRepository.save(perfil));
    }

    public PerfilDTO toDTO(Perfil perfil) {
        PerfilDTO dto = new PerfilDTO();
        dto.setId(perfil.getId());
        dto.setNombre(perfil.getNombre());
        dto.setApellidos(perfil.getApellidos());
        dto.setEmail(perfil.getEmail());
        dto.setDni(perfil.getDni());
        dto.setRol(perfil.getRol());
        dto.setRelJuridica(perfil.getRelJuridica());
        dto.setAniosServicio(perfil.getAniosServicio());
        dto.setHaceSustitucion(perfil.getHaceSustitucion());
        dto.setConsentimientoRgpd(perfil.getConsentimientoRgpd());
        dto.setCreatedAt(perfil.getCreatedAt());
        return dto;
    }
}