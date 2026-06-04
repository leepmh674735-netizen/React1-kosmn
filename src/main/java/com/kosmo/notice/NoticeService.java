package com.kosmo.notice;

import com.kosmo.global.common.FileStore;
import com.kosmo.global.common.UploadFileDTO;
import com.kosmo.member.MemberDTO;
import com.kosmo.member.MemberRepository;
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

    public List<Notice> getList() throws Exception {
        return noticeRepository.findAllOrderByPinnedAndLatest();
    }

    public List<Notice> getListByCategory(String category) throws Exception {
        if ("전체".equals(category) || category == null || category.trim().isEmpty()) {
            return noticeRepository.findAllOrderByPinnedAndLatest();
        }
        return noticeRepository.findByCategoryOrderByPinnedAndLatest(category);
    }

    public Notice getDetail(Long id) throws Exception {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다. id=" + id));
    }

    @Transactional
    public Notice create(Notice notice, List<MultipartFile> files, String username) throws Exception {
        if (files != null && files.size() > 5) {
            throw new IllegalArgumentException("첨부파일은 최대 5개까지만 업로드할 수 있습니다.");
        }

        if (username != null && !username.trim().isEmpty()) {
            MemberDTO member = memberRepository.findById(username).orElse(null);
            if (member != null) {
                notice.setMember(member);
                notice.setAuthorName(member.getName());
            }
        }

        Notice savedNotice = noticeRepository.save(notice);

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