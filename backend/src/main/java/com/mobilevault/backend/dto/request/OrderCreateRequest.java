package com.mobilevault.backend.dto.request;

public record OrderCreateRequest(
        Long productId,
        String customerFirstName,
        String customerLastName,
        String customerEmail,
        String customerPhone,
        String deliveryAddress,
        String deliveryCity,
        String deliveryNotes,
        String paymentReference
) {
}
