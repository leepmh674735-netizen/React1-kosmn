package com.winter.app.notice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    // 1. 상단 고정글(isPinned DESC)이 우선 정렬되고, 그 다음 최신 공지글 순으로 조회 (N+1 방지 fetch join 추가)
    @Query("SELECT DISTINCT n FROM Notice n LEFT JOIN FETCH n.files ORDER BY n.isPinned DESC, n.createdAt DESC")
    List<Notice> findAllOrderByPinnedAndLatest();
    
    // 2. 특정 카테고리 내에서 고정글 우선 정렬 조회
    @Query("SELECT DISTINCT n FROM Notice n LEFT JOIN FETCH n.files WHERE n.category = :category ORDER BY n.isPinned DESC, n.createdAt DESC")
    List<Notice> findByCategoryOrderByPinnedAndLatest(@Param("category") String category);
}

