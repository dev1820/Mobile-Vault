package com.mobilevault.backend.dto.request;

import com.mobilevault.backend.entity.SellRequestStatus;
import jakarta.validation.constraints.NotNull;

public record SellRequestStatusUpdateRequest(
        @NotNull SellRequestStatus status
) {
}
