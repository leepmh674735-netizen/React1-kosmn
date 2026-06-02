package com.winter.app.notice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @GetMapping("notice/list")
    public List<NoticeDTO> list() throws  Exception {

        return noticeService.getList();
    }

    @GetMapping("notice/detail/{id}")
    public NoticeDTO detail(@PathVariable(name = "id") Long id) throws Exception {

        return noticeService.getDetail(id);
    }
}
