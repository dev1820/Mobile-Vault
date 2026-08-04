package com.mobilevault.backend.dto.response;

import com.mobilevault.backend.entity.ComplaintStatus;
import com.mobilevault.backend.entity.ComplaintType;

import java.time.Instant;
import java.util.List;

public record ComplaintResponse(
        Long id,
        String fullName,
        String email,
        String phoneNumber,
        String orderNumber,
        ComplaintType complaintType,
        String description,
        String videoUrl,
        ComplaintStatus status,
        Instant createdAt,
        Instant updatedAt,
        List<ComplaintImageResponse> images
) {
}
