package com.winter.app.member;

import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public MemberDTO join(MemberDTO memberDTO) throws Exception {
        if (memberDTO.getPassword() == null || memberDTO.getPasswordCheck() == null) {
            throw new IllegalArgumentException("비밀번호 입력 값이 올바르지 않습니다.");
        }
        if (!memberDTO.getPassword().equals(memberDTO.getPasswordCheck())){
            throw new IllegalArgumentException("비밀번호가 서로 일치 하지 않습니다.");
        }

        String encodedPassword = passwordEncoder.encode(memberDTO.getPassword());
        memberDTO.setPassword(encodedPassword);

        return memberRepository.save(memberDTO);
    }
}