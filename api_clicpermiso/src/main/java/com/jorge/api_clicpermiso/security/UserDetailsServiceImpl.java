package com.jorge.api_clicpermiso.security;

import com.jorge.api_clicpermiso.model.Perfil;
import com.jorge.api_clicpermiso.repository.PerfilRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final PerfilRepository perfilRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Perfil perfil = perfilRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        return User.builder()
                .username(perfil.getId())
                .password(perfil.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority(
                        "ROLE_" + perfil.getRol().toUpperCase())))
                .build();
    }
}