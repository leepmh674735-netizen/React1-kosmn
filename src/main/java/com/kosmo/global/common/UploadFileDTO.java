package com.kosmo.global.common;

public record UploadFileDTO(
    String originalName,
    String storedName,
    String contentType,
    Long fileSize
) {}
