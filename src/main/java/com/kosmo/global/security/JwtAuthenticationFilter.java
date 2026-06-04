package com.kosmo.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import java.io.IOException;

public class JwtAuthenticationFilter extends BasicAuthenticationFilter {

    private final JwtTokenManger jwtTokenManger; // 유지

    // 생성자 주입
    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtTokenManger jwtTokenManger) {
        super(authenticationManager);
        this.jwtTokenManger = jwtTokenManger;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("=== JWT 토큰 검증 필터 진입 ===");

        // 1. HTTP 요청 헤더에서 Authorization 값을 꺼내옵니다.
        String header = request.getHeader("Authorization");

        // 2. 헤더가 없거나 Bearer 형식이 아니라면 다음 필터로 그냥 통과시킵니다.
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return; // 인증 없이 다음 필터로 진행 후 메서드 종료
        }

        try {
            // 3. "Bearer " 뒤의 순수한 토큰 문자열만 추출
            String token = header.substring(7);

            // 4. JwtTokenManger를 이용해 토큰을 검증하고 Authentication(인증) 객체를 생성합니다.
            Authentication authentication = jwtTokenManger.getAuthenticationByToken(token);

            // 5. 검증 완료된 인증 객체를 시큐리티 세션(SecurityContext)에 저장합니다.
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("JWT 토큰 인증 성공: " + authentication.getName());

            // 6. 인증 성공 시 다음 필터 체인을 계속 진행시킵니다.
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            System.out.println("JWT 토큰 만료 또는 유효하지 않음: " + e.getMessage());

            // 토큰 검증에 실패하면 시큐리티 컨텍스트를 깨끗이 비워 비인증 사용자로 만듭니다.
            SecurityContextHolder.clearContext();

            // 인증 실패 시 즉시 401 에러를 반환합니다.
            sendErrorResponse(response, "토큰이 만료되었거나 유효하지 않습니다.");
        }
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 상태코드
        response.setContentType("application/json; charset=UTF-8");

        String jsonResponse = String.format("{\"status\": 401, \"error\": \"Unauthorized\", \"message\": \"%s\"}", message);

        response.getWriter().write(jsonResponse);
    }
}