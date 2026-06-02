package com.winter.app.notice;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NoticeService {

    // @Autowired 대신 생성자 주입 방식 사용 (스프링 4.3부터 생성자 1개면 어노테이션 생략 가능)
    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    /**
     * 공지사항 전체 조회
     */
    public List<NoticeDTO> getList() throws Exception {
        return noticeRepository.findAll().stream()
                .map(notice -> {
                    NoticeDTO dto = new NoticeDTO();
                    dto.setId(notice.getId());
                    dto.setTitle(notice.getTitle());
                    dto.setAuthor(notice.getAuthor());
                    return dto;
                })
                .toList(); // Java 16+ 스펙 (이하 버전이라면 .collect(java.util.stream.Collectors.toList()) 사용)
    }

    /**
     * 공지사항 상세 조회
     */
    public NoticeDTO getDetail(Long id) throws Exception {
        // 1. Repository에서 엔티티(Notice)를 먼저 찾습니다. (문자열 "id"가 아닌 매개변수 id 전달)
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 존재하지 않습니다. id=" + id));

        // 2. 조회된 엔티티 데이터를 DTO에 담아서 반환합니다.
        NoticeDTO noticeDTO = new NoticeDTO();
        noticeDTO.setId(notice.getId());
        noticeDTO.setTitle(notice.getTitle());
        noticeDTO.setContent(notice.getContent());
        noticeDTO.setAuthor(notice.getAuthor());

        return noticeDTO;
    }
}