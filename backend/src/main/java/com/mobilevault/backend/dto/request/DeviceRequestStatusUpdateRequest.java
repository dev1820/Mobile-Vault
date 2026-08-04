package com.mobilevault.backend.dto.request;

import com.mobilevault.backend.entity.DeviceRequestStatus;
import jakarta.validation.constraints.NotNull;

public record DeviceRequestStatusUpdateRequest(
        @NotNull DeviceRequestStatus status
) {
}
