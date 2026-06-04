package com.kosmo.notice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    @Query("SELECT DISTINCT n FROM Notice n LEFT JOIN FETCH n.files ORDER BY n.isPinned DESC, n.createdAt DESC")
    List<Notice> findAllOrderByPinnedAndLatest();
    
    @Query("SELECT DISTINCT n FROM Notice n LEFT JOIN FETCH n.files WHERE n.category = :category ORDER BY n.isPinned DESC, n.createdAt DESC")
    List<Notice> findByCategoryOrderByPinnedAndLatest(@Param("category") String category);
}
