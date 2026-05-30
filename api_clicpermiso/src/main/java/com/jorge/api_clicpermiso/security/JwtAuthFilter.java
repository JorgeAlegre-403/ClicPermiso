package com.jorge.api_clicpermiso.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        System.out.println("DEBUG: Request [" + request.getMethod() + "] to [" + request.getRequestURI() + "] - AuthHeader: [" + (authHeader != null ? "Present" : "Missing") + "]");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.isTokenValid(token)) {
                String userId = jwtUtil.extractUserId(token);
                String rol    = jwtUtil.extractRol(token);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + rol.toUpperCase()))
                        );

                SecurityContextHolder.getContext().setAuthentication(auth);
                System.out.println("DEBUG: User [" + userId + "] authenticated with role [" + rol + "]");
            } else {
                System.out.println("DEBUG: Token invalid or expired for request to [" + request.getRequestURI() + "]");
            }
        } else if (!request.getRequestURI().contains("/api/auth") && !request.getRequestURI().contains("/uploads")) {
            System.out.println("DEBUG: No Bearer token found for protected request to [" + request.getRequestURI() + "]");
        }

        filterChain.doFilter(request, response);
    }
}