package com.mobilevault.backend.dto.request;

import com.mobilevault.backend.entity.AccessoriesIncluded;
import com.mobilevault.backend.entity.RepairStatus;
import com.mobilevault.backend.entity.SimStatus;

import java.math.BigDecimal;

public record SellRequestCreateRequest(
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
        BigDecimal expectedPriceRupees
) {
}
