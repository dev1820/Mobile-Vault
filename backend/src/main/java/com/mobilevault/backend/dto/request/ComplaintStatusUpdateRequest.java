package com.mobilevault.backend.dto.request;

import com.mobilevault.backend.entity.ComplaintStatus;
import jakarta.validation.constraints.NotNull;

public record ComplaintStatusUpdateRequest(
        @NotNull ComplaintStatus status
) {
}
