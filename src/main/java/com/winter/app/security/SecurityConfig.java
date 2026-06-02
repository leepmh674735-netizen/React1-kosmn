package com.winter.app.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtTokenManger jwtTokenManger;

    @Autowired
    private

    // AuthenticationManager를 가져오기 위한 설정 주입
    private final AuthenticationConfiguration authenticationConfiguration;

    public SecurityConfig(AuthenticationConfiguration authenticationConfiguration) {
        this.authenticationConfiguration = authenticationConfiguration;
    }

    // AuthenticationManager를 Bean으로 등록하여 필터에 제공할 수 있도록 함
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. CORS 및 CSRF 비활성화
                .cors(cors -> cors.disable())
                .csrf(csrf -> csrf.disable())

                // 2. HTTP 요청 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/notice/add").hasRole("ADMIN") // /notice/add는 ADMIN 권한 필요
                        .anyRequest().permitAll()                        // 그 외의 모든 요청은 허용
                )

                // 3. 기본 폼 로그인 활성화 (JWT를 쓰신다면 비활성화(.disable()) 하셔도 좋습니다)
                .formLogin(Customizer.withDefaults())

                // 4. 세션 관리 설정
                // JWT 인증 방식을 사용하는 경우 서버가 세션을 상태 비저장(STATELESS)으로 관리해야 하므로 아래 설정을 추천합니다.
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 5. HTTP Basic 인증 활성화
                .httpBasic(Customizer.withDefaults()); h.disable())

        // 6. JWT 로그인 커스텀 필터 등록
        // 필터를 생성할 때 authenticationManager를 주입해주어야 아이디/패스워드 검증이 가능합니다.
        JwtLoginFilter jwtLoginFilter = new JwtLoginFilter();
        jwtLoginFilter.setAuthenticationManager(authenticationConfiguration()authenticationConfiguration));

        // 기존 UsernamePasswordAuthenticationFilter 위치에 커스텀 JWT 로그인 필터를 대체하여 넣거나 그 앞에 둡니다.
        http.addFilterAt(jwtLoginFilter, UsernamePasswordAuthenticationFilter.class);

        // 매개변수명이 'http'이므로 http.build()를 호출하여 리턴해야 합니다.
        return http.build();
    }
}