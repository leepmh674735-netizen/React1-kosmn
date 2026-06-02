package com.winter.app.notice;

import com.winter.app.common.FileStore;
import com.winter.app.common.UploadFileDTO;
import com.winter.app.member.MemberDTO;
import com.winter.app.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final NoticeFileRepository noticeFileRepository;
    private final MemberRepository memberRepository;
    private final FileStore fileStore;

    /**
     * 공지사항 전체 조회 (상단 고정글 우선 정렬)
     */
    public List<Notice> getList() throws Exception {
        return noticeRepository.findAllOrderByPinnedAndLatest();
    }

    /**
     * 카테고리별 공지사항 조회
     */
    public List<Notice> getListByCategory(String category) throws Exception {
        if ("전체".equals(category) || category == null || category.trim().isEmpty()) {
            return noticeRepository.findAllOrderByPinnedAndLatest();
        }
        return noticeRepository.findByCategoryOrderByPinnedAndLatest(category);
    }

    /**
     * 공지사항 상세 조회
     */
    public Notice getDetail(Long id) throws Exception {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다. id=" + id));
    }

    /**
     * 공지사항 등록 (최대 5개 첨부파일 등록 포함)
     */
    @Transactional
    public Notice create(Notice notice, List<MultipartFile> files, String username) throws Exception {
        // 1. 첨부파일 개수 유효성 검사 (최대 5개)
        if (files != null && files.size() > 5) {
            throw new IllegalArgumentException("첨부파일은 최대 5개까지만 업로드할 수 있습니다.");
        }

        // 2. 작성 회원 정보 매핑
        if (username != null && !username.trim().isEmpty()) {
            MemberDTO member = memberRepository.findById(username).orElse(null);
            if (member != null) {
                notice.setMember(member);
                notice.setAuthorName(member.getName());
            }
        }

        // 3. 공지사항 본문 선저장 (ID 획득)
        Notice savedNotice = noticeRepository.save(notice);

        // 4. 첨부파일 저장 및 매핑
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    UploadFileDTO uploadFile = fileStore.storeFile(file, "notices");
                    if (uploadFile != null) {
                        NoticeFile noticeFile = new NoticeFile();
                        noticeFile.setNotice(savedNotice);
                        noticeFile.setOriginalName(uploadFile.originalName());
                        noticeFile.setStoredName(uploadFile.storedName());
                        noticeFile.setContentType(uploadFile.contentType());
                        noticeFile.setFileSize(uploadFile.fileSize());

                        noticeFileRepository.save(noticeFile);
                        savedNotice.getFiles().add(noticeFile);
                    }
                }
            }
        }

        return savedNotice;
    }
}