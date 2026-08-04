package com.mobilevault.backend.dto.request;

import com.mobilevault.backend.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateRequest(
        @NotNull OrderStatus status
) {
}
