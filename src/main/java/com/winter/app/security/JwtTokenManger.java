package com.winter.app.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.winter.app.member.MemberDTO;
import com.winter.app.member.MemberRepository;

import io.jsonwebtoken.Claims; // [추가] Claims 임포트 필요
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

    // [유지] 변수명을 Key로 유지하셨으므로, 아래 선언과 초기화 코드를 일치시킵니다.
    private SecretKey Key;

    @Autowired
    private MemberRepository memberRepository;

    @PostConstruct
    public void init() {
        // [수정] this.secretKey -> this.Key로 변경하여 멤버 변수명과 일치시킴
        this.Key = Keys.hmacShaKeyFor(this.secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    public String createAccessToken(Authentication authentication) {
        return this.createToken(authentication, accessValidTime);
    }
    public String createRefreshToken(Authentication authentication) {
        return this.createToken(authentication, refreshValidTime);
    }


    // 토큰을 생성하는 메서드
    private String createToken(Authentication authentication, Long validTime) {

        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + validTime);

        return Jwts.builder()
                // 1. 사용자 정보 설정 (Subject)
                .subject(authentication.getName())

                // 2. Token 생성 시간 설정
                .issuedAt(now)

                // 3. Token 만료 시간 설정
                .expiration(expirationDate)

                // 4. 발급자 설정
                .issuer(issuer)

                // 5. 암호화 알고리즘 및 Key 설정 [수정] 대문자 SecretKey -> 멤버 변수명인 'Key' 혹은 'this.Key'로 변경
                .signWith(this.Key)

                // 6. 압축 및 토큰 발행
                .compact();
    }

    // Token 검증 및 Authentication 객체 생성
    public Authentication getAuthenticationByToken(String token) throws Exception {

        // [수정] claims -> Claims 클래스 대문자 시작, parset() -> parser(), varifyWith -> verifyWith() 오타 교정
        Claims claims = Jwts.parser()
                .verifyWith(this.Key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        // [수정] 데이터베이스에서 해당 사용자 정보(UserDetails) 조회
        // memberRepository가 Optional을 반환한다고 가정하고 .orElseThrow() 처리를 해주는 것이 안전합니다.
        // MemberDTO가 UserDetails를 구현(implements UserDetails)하고 있어야 이 다형성이 성립합니다.
        UserDetails userDetails = memberRepository.findById(claims.getSubject())
                .orElseThrow(() -> new Exception("존재하지 않는 회원입니다."));

        // [수정] 토큰 생성자 매개변수 오타 전면 교정
        // meberDTO -> userDetails
        // credenticals:null -> null
        // memberDTO.getAtrribute -> userDetails.getAuthorities() (시큐리티 표준 권한 메서드)
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        return authentication;
    }
}