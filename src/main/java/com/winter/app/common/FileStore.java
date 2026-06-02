package com.winter.app.common;

import com.winter.app.config.UploadProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class FileStore {

    private final UploadProperties uploadProperties;

    public UploadFileDTO storeFile(MultipartFile file, String category) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "unnamed";
        }

        String ext = extractExt(originalFilename);
        String uuid = UUID.randomUUID().toString();
        String storedFilename = uuid + "." + ext;

        // Get resolved path for the target category folder
        String dirPath = uploadProperties.getResolvedPath(category);
        File dir = new File(dirPath);
        if (!dir.exists()) {
            boolean created = dir.mkdirs();
            log.info("Upload directory created: {}, result: {}", dirPath, created);
        }

        String fullPath = dirPath + File.separator + storedFilename;
        file.transferTo(new File(fullPath));

        log.info("Saved file. Original: {}, Stored: {}, Size: {} bytes", originalFilename, storedFilename, file.getSize());

        return new UploadFileDTO(
                originalFilename,
                storedFilename,
                file.getContentType(),
                file.getSize()
        );
    }

    private String extractExt(String filename) {
        int pos = filename.lastIndexOf(".");
        if (pos == -1) {
            return "";
        }
        return filename.substring(pos + 1);
    }
}
