package com.mobilevault.backend.dto.request;

import com.mobilevault.backend.entity.ProductCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DeviceRequestCreateRequest(
        @NotNull ProductCategory category,
        @NotBlank String itemName,
        @NotBlank String details,
        @DecimalMin(value = "0", inclusive = true) BigDecimal budgetRupees,
        @NotBlank String customerName,
        @NotBlank String customerPhone,
        @NotBlank @Email String customerEmail
) {
}
