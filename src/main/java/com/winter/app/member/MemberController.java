package com.winter.app.member;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/member")
@Slf4j
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/join")
    public ResponseEntity<?> join(
            @Valid @ModelAttribute MemberDTO memberDTO,
            BindingResult bindingResult,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) throws Exception {

        log.info("회원 가입 요청 진입 - Member: {}, Profile Image: {}", memberDTO, 
                profileImage != null ? profileImage.getOriginalFilename() : "없음");

        // Controller 진입 시 username이 비어있고 email이 있으면 username을 email로 채워 넣어서 검증 오류를 방지함
        if ((memberDTO.getUsername() == null || memberDTO.getUsername().trim().isEmpty()) && memberDTO.getEmail() != null) {
            memberDTO.setUsername(memberDTO.getEmail());
        }
        
        // passwordCheck가 누락된 경우 password와 동일하게 설정하여 서비스 유효성 검사를 통과시킴
        if (memberDTO.getPasswordCheck() == null) {
            memberDTO.setPasswordCheck(memberDTO.getPassword());
        }

        if (bindingResult.hasErrors()) {
            log.warn("유효성 검증 실패: {}", bindingResult.getAllErrors());
            return ResponseEntity.badRequest().body("입력 값이 올바르지 않습니다.");
        }

        if (memberDTO == null) {
            throw new Exception("요청 데이터가 비어있습니다.");
        }

        MemberDTO result = memberService.join(memberDTO, profileImage);

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
