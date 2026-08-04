package com.mobilevault.backend.dto.response;

import com.mobilevault.backend.entity.AccessoriesIncluded;
import com.mobilevault.backend.entity.RepairStatus;
import com.mobilevault.backend.entity.SellRequestStatus;
import com.mobilevault.backend.entity.SimStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record SellRequestResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String phoneCompany,
        String model,
        Integer conditionRating,
        String storageCapacity,
        SimStatus simStatus,
        RepairStatus repairStatus,
        AccessoriesIncluded accessories,
        String deviceSerialNumber,
        String deviceDetails,
        BigDecimal expectedPriceRupees,
        String videoUrl,
        SellRequestStatus status,
        Instant createdAt,
        Instant updatedAt,
        List<SellRequestImageResponse> images
) {
}
