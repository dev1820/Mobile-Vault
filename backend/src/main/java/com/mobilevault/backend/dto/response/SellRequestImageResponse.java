package com.mobilevault.backend.dto.response;

public record SellRequestImageResponse(
        Long id,
        String url,
        Integer sortOrder
) {
}
