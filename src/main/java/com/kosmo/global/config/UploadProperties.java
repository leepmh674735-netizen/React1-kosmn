package com.kosmo.global.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.upload")
public class UploadProperties {
    private String baseDir;
    private Map<String, String> subDirs = new HashMap<>();

    public String getResolvedPath(String category) {
        String subDir = subDirs.get(category);
        if (subDir == null) {
            throw new IllegalArgumentException("Unknown upload category: " + category);
        }
        return baseDir + File.separator + subDir;
    }
}
