package com.winter.app.notice;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notice/*")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class NotController {

    private final NoticeService noticeService;

    @GetMapping("list")
    public List<NoticeDTO> list() throws Exception {
        return noticeService.getList();
    }

    // Detail using query parameter: /notice/detail?id=1
    @GetMapping("detail")
    public NoticeDTO detail(@RequestParam("id") Long id) throws Exception {
        return noticeService.getDetail(id);
    }

    // Detail using path variable: /notice/detail/1
    @GetMapping("detail/{id}")
    public NoticeDTO detailPath(@PathVariable("id") Long id) throws Exception {
        return noticeService.getDetail(id);
    }

    @PostMapping("create")
    public ResponseEntity<Integer> create(@RequestBody NoticeDTO noticeDTO) throws Exception {
        int result = noticeService.create(noticeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
