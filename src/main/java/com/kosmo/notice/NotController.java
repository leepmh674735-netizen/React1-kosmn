package com.kosmo.notice;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class NotController {

    private final NoticeService noticeService;

    // 공지사항 목록 조회 (고정글 우선 최신순 정렬)
    @GetMapping("/list")
    public List<Notice> list() throws Exception {
        return noticeService.getList();
    }

    // 카테고리별 공지사항 조회
    @GetMapping("/list/category")
    public List<Notice> listByCategory(@RequestParam("category") String category) throws Exception {
        return noticeService.getListByCategory(category);
    }

    // 쿼리 파라미터 상세 조회: /notice/detail?id=1
    @GetMapping("/detail")
    public Notice detail(@RequestParam("id") Long id) throws Exception {
        return noticeService.getDetail(id);
    }

    // 경로 변수 상세 조회: /notice/detail/1
    @GetMapping("/detail/{id}")
    public Notice detailPath(@PathVariable("id") Long id) throws Exception {
        return noticeService.getDetail(id);
    }

    // 공지사항 등록 (다중 첨부파일 최대 5개 지원)
    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<?> create(
            @ModelAttribute Notice notice,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "username", required = false) String username) throws Exception {

        log.info("공지사항 등록 요청 - Notice: {}, 첨부파일 개수: {}, 작성자ID: {}", 
                notice.getTitle(), files != null ? files.size() : 0, username);

        Notice result = noticeService.create(notice, files, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
