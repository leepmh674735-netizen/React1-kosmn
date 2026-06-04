package com.kosmo.member;

import com.kosmo.global.common.FileStore;
import com.kosmo.global.common.UploadFileDTO;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@AllArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStore fileStore;

    @Transactional
    public MemberDTO join(MemberDTO memberDTO, MultipartFile profileImage) throws Exception {
        if (memberDTO.getPassword() == null || memberDTO.getPasswordCheck() == null) {
            throw new IllegalArgumentException("비밀번호 입력 값이 올바르지 않습니다.");
        }
        if (!memberDTO.getPassword().equals(memberDTO.getPasswordCheck())){
            throw new IllegalArgumentException("비밀번호가 서로 일치 하지 않습니다.");
        }

        // If username is empty, fallback to email
        if (memberDTO.getUsername() == null || memberDTO.getUsername().trim().isEmpty()) {
            memberDTO.setUsername(memberDTO.getEmail());
        }

        String encodedPassword = passwordEncoder.encode(memberDTO.getPassword());
        memberDTO.setPassword(encodedPassword);

        MemberDTO savedMember = memberRepository.save(memberDTO);

        if (profileImage != null && !profileImage.isEmpty()) {
            UploadFileDTO uploadFile = fileStore.storeFile(profileImage, "members");
            if (uploadFile != null) {
                MemberProfile profile = new MemberProfile();
                profile.setMember(savedMember);
                profile.setOriginalName(uploadFile.originalName());
                profile.setStoredName(uploadFile.storedName());
                profile.setContentType(uploadFile.contentType());
                profile.setFileSize(uploadFile.fileSize());

                memberProfileRepository.save(profile);
                savedMember.setMemberProfile(profile);
            }
        }

        return savedMember;
    }
}