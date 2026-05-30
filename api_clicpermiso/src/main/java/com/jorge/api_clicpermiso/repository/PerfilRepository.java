package com.jorge.api_clicpermiso.repository;

import com.jorge.api_clicpermiso.model.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PerfilRepository extends JpaRepository<Perfil, String> {
    Optional<Perfil> findByEmail(String email);
    boolean existsByEmail(String email);
}