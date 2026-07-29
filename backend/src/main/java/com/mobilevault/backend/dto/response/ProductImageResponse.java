package com.mobilevault.backend.dto.response;

public record ProductImageResponse(
        Long id,
        String url,
        Integer sortOrder
) {
}
