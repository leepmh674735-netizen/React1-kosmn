package com.winter.app.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException; // [추가] 시큐리티 예외용
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.winter.app.member.MemberDTO;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenManger jwtTokenManger; // 오타가 아니라면 Manger 그대로 유지
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 생성자 주입
    public JwtLoginFilter(AuthenticationManager authenticationManager, JwtTokenManger jwtTokenManger) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenManger = jwtTokenManger;
        // 로그인 요청을 처리할 URL 설정
        this.setFilterProcessesUrl("/member/login");
    }

    // 1. 로그인 인증 시도 단계
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        System.out.println("=== [JwtLoginFilter] 로그인 인증 시도 ===");

        try {
            // 요청 바디의 JSON 데이터를 MemberDTO 객체로 변환
            MemberDTO memberDTO = objectMapper.readValue(request.getInputStream(), MemberDTO.class);

            // 미인증 상태의 Authentication 토큰 생성
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    memberDTO.getUsername(),
                    memberDTO.getPassword()
            );

            // AuthenticationManager를 통해 실제 인증 위임 (UserDetailsService 호출됨)
            return authenticationManager.authenticate(authenticationToken);

        } catch (IOException e) {
            System.out.println("로그인 요청 JSON 파싱 실패: " + e.getMessage());
            // [수정] 일반 RuntimeException 대신 시큐리티 전용 예외를 던져 unsuccessfulAuthentication으로 흐름을 넘깁니다.
            throw new AuthenticationServiceException("로그인 요청 데이터 형식이 올바르지 않습니다.", e);
        }
    }

    // 2. 로그인 인증 성공 단계 (Access Token & Refresh Token 발급 및 응답)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        System.out.println("=== [JwtLoginFilter] 로그인 성공 ===");

        // 1) 토큰 생성
        String accessToken = jwtTokenManger.makeToken(authResult);
        String refreshToken = jwtTokenManger.makeRefreshToken(authResult);

        // 2) Access Token은 전역 표준대로 'Authorization' 헤더에 담기
        response.addHeader("Authorization", "Bearer " + accessToken);

        // 3) Refresh Token은 보안을 위해 HttpOnly 쿠키에 담기
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false); // HTTPS 환경이라면 true로 변경하는 것이 좋습니다.
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(14 * 24 * 60 * 60); // 2주 수명
        response.addCookie(refreshCookie);

        // 4) 응답 설정 및 ObjectMapper를 이용한 JSON 바디 작성
        response.setContentType("application/json; charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);

        // 응답용 데이터를 Map으로 구성
        Map<String, Object> map = new HashMap<>();
        map.put("message", "로그인 성공");
        map.put("accessToken", accessToken);

        // [수정] 중복 코드를 제거하고 이미 변환된 jsonResponse 변수를 활용하여 응답을 작성합니다.
        String jsonResponse = objectMapper.writeValueAsString(map);
        response.getWriter().write(jsonResponse);
    }

    // 3. 로그인 인증 실패 단계
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed) throws IOException, ServletException {
        System.out.println("=== [JwtLoginFilter] 로그인 실패: " + failed.getMessage() + " ===");

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json; charset=UTF-8");

        // 에러 메시지에 구체적인 실패 원인(failed.getMessage())을 적절히 조합하면 디버깅에 좋습니다.
        response.getWriter().write("{\"message\": \"로그인 실패: 아이디 또는 비밀번호를 확인하세요.\"}");
    }
}