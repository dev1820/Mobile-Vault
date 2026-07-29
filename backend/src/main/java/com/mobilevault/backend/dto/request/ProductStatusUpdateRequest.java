package com.mobilevault.backend.dto.request;

import com.mobilevault.backend.entity.ProductStatus;
import jakarta.validation.constraints.NotNull;

public record ProductStatusUpdateRequest(
        @NotNull ProductStatus status
) {
}
