package com.kosmo.global.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.kosmo.member.MemberRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtTokenManger {

    @Value("${jwt.access-valid-time}")
    private Long accessValidTime;

    @Value("${jwt.refresh-valid-time}")
    private Long refreshValidTime;

    @Value("${jwt.issuer}")
    private String issuer;

    @Value("${jwt.secret-key}")
    private String secretKeyString;

    private SecretKey Key;

    @Autowired
    private MemberRepository memberRepository;

    @PostConstruct
    public void init() {
        this.Key = Keys.hmacShaKeyFor(this.secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    public String createAccessToken(Authentication authentication) {
        return this.createToken(authentication, accessValidTime);
    }
    public String createRefreshToken(Authentication authentication) {
        return this.createToken(authentication, refreshValidTime);
    }

    private String createToken(Authentication authentication, Long validTime) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + validTime);

        return Jwts.builder()
                .subject(authentication.getName())
                .issuedAt(now)
                .expiration(expirationDate)
                .issuer(issuer)
                .signWith(this.Key)
                .compact();
    }

    public Authentication getAuthenticationByToken(String token) throws Exception {
        Claims claims = Jwts.parser()
                .verifyWith(this.Key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        UserDetails userDetails = memberRepository.findById(claims.getSubject())
                .orElseThrow(() -> new Exception("존재하지 않는 회원입니다."));

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        return authentication;
    }
}