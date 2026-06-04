package com.kosmo.global.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kosmo.member.MemberDTO;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtLoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenManger jwtTokenManger;
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
            MemberDTO memberDTO = objectMapper.readValue(request.getInputStream(), MemberDTO.class);

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    memberDTO.getUsername(),
                    memberDTO.getPassword()
            );

            return authenticationManager.authenticate(authenticationToken);

        } catch (IOException e) {
            System.out.println("로그인 요청 JSON 파싱 실패: " + e.getMessage());
            throw new AuthenticationServiceException("로그인 요청 데이터 형식이 올바르지 않습니다.", e);
        }
    }

    // 2. 로그인 인증 성공 단계
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        System.out.println("=== [JwtLoginFilter] 로그인 성공 ===");

        String accessToken = jwtTokenManger.createAccessToken(authResult);
        String refreshToken = jwtTokenManger.createRefreshToken(authResult);

        response.addHeader("Authorization", "Bearer " + accessToken);

        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(false);
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge(14 * 24 * 60 * 60); // 2주 수명
        response.addCookie(refreshCookie);

        response.setContentType("application/json; charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);

        Map<String, Object> map = new HashMap<>();
        map.put("message", "로그인 성공");
        map.put("accessToken", accessToken);

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

        response.getWriter().write("{\"message\": \"로그인 실패: 아이디 또는 비밀번호를 확인하세요.\"}");
    }
}