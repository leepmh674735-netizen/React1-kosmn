package com.winter.app.member;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/member")
@Slf4j
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/join")
    public ResponseEntity<?> join(@Valid @RequestBody MemberDTO memberDTO, BindingResult bindingResult) throws Exception {

        log.info("회원 가입 요청 진입 : {}", memberDTO);

        if (bindingResult.hasErrors()) {
            log.warn("유효성 검증 실패: {}", bindingResult.getAllErrors());
            return ResponseEntity.badRequest().body("입력 값이 올바르지 않습니다.");
        }

        if (memberDTO == null) {
            throw new Exception("요청 데이터가 비어있습니다.");
        }

        MemberDTO result = memberService.join(memberDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
