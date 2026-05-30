package com.jorge.api_clicpermiso.controller;

import com.jorge.api_clicpermiso.dto.perfil.PerfilDTO;
import com.jorge.api_clicpermiso.dto.perfil.PerfilUpdateDTO;
import com.jorge.api_clicpermiso.service.PerfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/perfiles")
@RequiredArgsConstructor
public class PerfilController {

    private final PerfilService perfilService;

    @GetMapping("/me")
    public ResponseEntity<PerfilDTO> getMe(Authentication auth) {
        return ResponseEntity.ok(perfilService.getPerfilById(auth.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<PerfilDTO> updateMe(Authentication auth,
                                               @RequestBody PerfilUpdateDTO dto) {
        return ResponseEntity.ok(perfilService.updatePerfil(auth.getName(), dto));
    }

    @PreAuthorize("hasRole('DIRECTIVO')")
    @GetMapping
    public ResponseEntity<List<PerfilDTO>> getAllPerfiles() {
        return ResponseEntity.ok(perfilService.getAllPerfiles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PerfilDTO> getPerfil(@PathVariable String id) {
        return ResponseEntity.ok(perfilService.getPerfilById(id));
    }
}