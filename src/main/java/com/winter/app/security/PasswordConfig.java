package com.winter.app.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PasswordConfig {
    @Bean
    PasswordEncoder passwordEncoder() {

        return  new BCryptPasswordEncoder();
    }
}
