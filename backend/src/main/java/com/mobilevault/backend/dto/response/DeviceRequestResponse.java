package com.mobilevault.backend.dto.response;

import com.mobilevault.backend.entity.DeviceRequestStatus;
import com.mobilevault.backend.entity.ProductCategory;

import java.math.BigDecimal;
import java.time.Instant;

public record DeviceRequestResponse(
        Long id,
        ProductCategory category,
        String itemName,
        String details,
        BigDecimal budgetRupees,
        String customerName,
        String customerPhone,
        String customerEmail,
        DeviceRequestStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
