package com.winter.app.member;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;

    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Member join(MemberDTO memberDTO)throws Exception {

        if (!memberDTO.getPassword().equals(memberDTO.getPasswordCheck())){
            throw new IllegalArgumentException("비밀번호가 서로 일치 하지 않습니다.");

            Member member = new Member();

            member.setUsername(memberDTO.getUsername());
            member.setName(memberDTO.getName());
           member.setEmail(memberDTO.getEmail());

        String encodendPassword = passwordEncoder.encode(memberDTO.getPassword());
        member.setPassword(encodendPassword);

       return memberRepository.save(member);
   }
}