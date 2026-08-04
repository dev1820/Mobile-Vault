package com.mobilevault.backend.dto.response;

import com.mobilevault.backend.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderResponse(
        Long id,
        Long productId,
        String productTitle,
        BigDecimal productPriceRupees,
        BigDecimal advanceAmountRupees,
        String customerFirstName,
        String customerLastName,
        String customerEmail,
        String customerPhone,
        String deliveryAddress,
        String deliveryCity,
        String deliveryNotes,
        String paymentProofUrl,
        String paymentReference,
        OrderStatus status,
        Instant createdAt,
        Instant updatedAt
) {
}
