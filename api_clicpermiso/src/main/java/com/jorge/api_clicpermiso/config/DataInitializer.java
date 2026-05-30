package com.jorge.api_clicpermiso.config;

import com.jorge.api_clicpermiso.model.Perfil;
import com.jorge.api_clicpermiso.repository.PerfilRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    @Bean
    CommandLineRunner seedUsers(PerfilRepository repo, PasswordEncoder encoder) {
        return args -> {
            try {
                System.out.println("\n========================================");
                System.out.println("  INICIALIZANDO DATOS DE PRUEBA");
                System.out.println("========================================");

                if (!repo.existsByEmail("admin@iesalbarregas.es")) {
                    System.out.println("\n➕ Creando usuario ADMIN...");
                    Perfil admin = new Perfil();
                    admin.setNombre("Admin");
                    admin.setApellidos("Directivo");
                    admin.setEmail("admin@iesalbarregas.es");
                    admin.setPassword(encoder.encode("admin123"));
                    admin.setRol("directivo");
                    admin.setRelJuridica("Funcionario Carrera");
                    admin.setAniosServicio(15);
                    admin.setHaceSustitucion(false);
                    admin.setConsentimientoRgpd(true);
                    repo.save(admin);
                    System.out.println("✅ USUARIO ADMIN CREADO");
                    System.out.println("   Email: admin@iesalbarregas.es");
                    System.out.println("   Password: admin123");
                    System.out.println("   Rol: Directivo");
                } else {
                    System.out.println("\nℹ️  El usuario ADMIN ya existe");
                }

                if (!repo.existsByEmail("docente@iesalbarregas.es")) {
                    System.out.println("\n➕ Creando usuario DOCENTE...");
                    Perfil docente = new Perfil();
                    docente.setNombre("Juan");
                    docente.setApellidos("García López");
                    docente.setEmail("docente@iesalbarregas.es");
                    docente.setPassword(encoder.encode("docente123"));
                    docente.setRol("docente");
                    docente.setRelJuridica("Interino");
                    docente.setAniosServicio(3);
                    docente.setHaceSustitucion(true);
                    docente.setConsentimientoRgpd(true);
                    repo.save(docente);
                    System.out.println("✅ USUARIO DOCENTE CREADO");
                    System.out.println("   Email: docente@iesalbarregas.es");
                    System.out.println("   Password: docente123");
                    System.out.println("   Rol: Docente");
                } else {
                    System.out.println("\nℹ️  El usuario DOCENTE ya existe");
                }

                // Listar todos los usuarios para confirmación
                System.out.println("\n📋 USUARIOS EN LA BASE DE DATOS:");
                System.out.println("─────────────────────────────────────");
                repo.findAll().forEach(u ->
                    System.out.println("  • " + u.getEmail() + " [Rol: " + u.getRol() + "]")
                );
                System.out.println("─────────────────────────────────────");
                System.out.println("========================================\n");

            } catch (Exception e) {
                System.err.println("❌ ERROR durante inicialización de datos:");
                e.printStackTrace();
            }
        };
    }
}