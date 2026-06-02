package com.winter.app.notice;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    /**
     * 공지사항 전체 조회
     */
    public List<NoticeDTO> getList() throws Exception {
        return noticeRepository.findAll();
    }

    /**
     * 공지사항 상세 조회
     */
    public NoticeDTO getDetail(Long id) throws Exception {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다. id=" + id));
    }

    /**
     * 공지사항 등록
     */
    @Transactional
    public int create(NoticeDTO noticeDTO) throws Exception {
        noticeRepository.save(noticeDTO);
        return 1;
    }
}