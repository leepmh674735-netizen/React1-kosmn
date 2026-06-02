package com.winter.app.common;

public record UploadFileDTO(
    String originalName,
    String storedName,
    String contentType,
    Long fileSize
) {}
