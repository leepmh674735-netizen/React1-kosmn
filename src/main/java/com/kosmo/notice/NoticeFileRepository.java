package com.kosmo.notice;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoticeFileRepository extends JpaRepository<NoticeFile, Long> {
    List<NoticeFile> findByNoticeId(Long noticeId);
}
