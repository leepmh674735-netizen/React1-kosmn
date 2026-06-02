package com.winter.app.notice;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/notice/*")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class NotController {

    private final NoticeService noticeService;


    @GetMapping("list")
    public List<NoticeDTO> list() throws  Exception {
        return noticeService.getList();
    }

    @GetMapping("detail/{id}")
    public NoticeDTO detail(@PathVariable("id") Long id) throws Exception {
        return  noticeService.getDetail(id);

    }
    @PostMapping("/create")
    public ResponseEnity<Integer> create(@ResquestBody NoticeDTO noticeDTO) throws Exception {
        int result = noticeService.create(noticeDTO);

        return  ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}
