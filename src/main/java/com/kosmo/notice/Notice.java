package com.kosmo.notice;

import com.kosmo.member.MemberDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notices")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String category = "일반"; // 일반, 이벤트, 중요

    @Column(name = "is_pinned", nullable = false)
    private Boolean isPinned = false; // 상단 고정 여부

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "username")
    private MemberDTO member; // 작성 회원 (탈퇴 시 DB에서 NULL 처리됨)

    @Column(name = "author_name")
    private String authorName; // 가입 당시 이름 보관용

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // 하나의 공지에 다중 파일 매핑
    @OneToMany(mappedBy = "notice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NoticeFile> files = new ArrayList<>();

    // 회원 탈퇴 시 기본값 처리 헬퍼 메소드
    public String getAuthor() {
        if (this.member == null) {
            return "탈퇴한 회원";
        }
        return this.member.getName();
    }
}
