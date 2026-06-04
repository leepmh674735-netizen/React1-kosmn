package com.kosmo.global.common;

import com.kosmo.global.config.UploadProperties;
import com.kosmo.notice.NoticeFile;
import com.kosmo.notice.NoticeFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriUtils;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FileController {

    private final NoticeFileRepository noticeFileRepository;
    private final UploadProperties uploadProperties;

    // 공통 파일 다운로드 API (ID 기반)
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam("id") Long id) throws MalformedURLException {
        // 1. 파일 DB 메타데이터 조회
        NoticeFile noticeFile = noticeFileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 파일입니다. id=" + id));

        // 2. 저장 폴더 경로 및 물리 파일 객체 생성
        String dirPath = uploadProperties.getResolvedPath("notices");
        File file = new File(dirPath + File.separator + noticeFile.getStoredName());

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        // 3. 파일 자원 객체화
        Resource resource = new UrlResource(file.toURI());

        // 4. 한글 파일명 다운로드 인코딩 처리
        String encodedUploadFileName = UriUtils.encode(noticeFile.getOriginalName(), StandardCharsets.UTF_8);
        String contentDisposition = "attachment; filename=\"" + encodedUploadFileName + "\"";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(resource);
    }
}
