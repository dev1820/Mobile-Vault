package com.mobilevault.backend.dto.request;

import com.mobilevault.backend.entity.ProductCategory;
import com.mobilevault.backend.entity.ProductCondition;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ProductUpdateRequest(
        @NotBlank String title,
        String description,
        @NotNull ProductCategory category,
        String model,
        String storageCapacity,
        String color,
        ProductCondition condition,
        @NotNull @DecimalMin(value = "0", inclusive = true) BigDecimal priceRupees,
        @Min(0) @Max(100) Integer batteryHealthPercent
) {
}
