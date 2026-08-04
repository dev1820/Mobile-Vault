package com.mobilevault.backend.dto.request;

import com.mobilevault.backend.entity.ComplaintType;

public record ComplaintCreateRequest(
        String fullName,
        String email,
        String phoneNumber,
        String orderNumber,
        ComplaintType complaintType,
        String description
) {
}
