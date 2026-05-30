package com.jorge.api_clicpermiso.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "solicitudes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Solicitud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Perfil perfil;

    @Column(name = "dia_solicitado", nullable = false)
    private LocalDate diaSolicitado;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "turno", nullable = false)
    private String turno;

    @Column(name = "jornada", nullable = false)
    private String jornada;

    @Column(name = "num_horas", nullable = false)
    private Integer numHoras;

    @Column(name = "num_dias", nullable = false)
    private Integer numDias;

    @Column(name = "permiso_no_retribuido")
    private Boolean permisoNoRetribuido = false;

    @Column(name = "motivo", columnDefinition = "TEXT", nullable = false)
    private String motivo;

    @Column(name = "archivo_adjunto")
    private String archivoAdjunto;

    @Column(name = "estado", nullable = false)
    private String estado = "pendiente";

    @Column(name = "motivo_rechazo", columnDefinition = "TEXT")
    private String motivoRechazo;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}