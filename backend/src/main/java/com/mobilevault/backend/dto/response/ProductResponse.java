package com.mobilevault.backend.dto.response;

import com.mobilevault.backend.entity.ProductCategory;
import com.mobilevault.backend.entity.ProductCondition;
import com.mobilevault.backend.entity.ProductStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProductResponse(
        Long id,
        String title,
        String description,
        ProductCategory category,
        String model,
        String storageCapacity,
        String color,
        ProductCondition condition,
        BigDecimal priceRupees,
        Integer batteryHealthPercent,
        ProductStatus status,
        Instant createdAt,
        Instant updatedAt,
        List<ProductImageResponse> images
) {
}
