package com.jorge.api_clicpermiso.repository;

import com.jorge.api_clicpermiso.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {

    List<Solicitud> findByPerfilIdOrderByCreatedAtDesc(String perfilId);

    List<Solicitud> findAllByOrderByCreatedAtDesc();

    @Query("SELECT s FROM Solicitud s " +
           "WHERE s.diaSolicitado BETWEEN :start AND :end " +
           "AND s.estado IN ('aprobada', 'pendiente')")
    List<Solicitud> findByCalendario(
        @Param("start") LocalDate start,
        @Param("end") LocalDate end
    );

    long countByEstado(String estado);
}