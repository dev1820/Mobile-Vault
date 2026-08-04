package com.mobilevault.backend.controller;

import com.mobilevault.backend.dto.request.SellRequestCreateRequest;
import com.mobilevault.backend.dto.response.SellRequestResponse;
import com.mobilevault.backend.entity.AccessoriesIncluded;
import com.mobilevault.backend.entity.RepairStatus;
import com.mobilevault.backend.entity.SimStatus;
import com.mobilevault.backend.service.SellRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/sell-requests")
public class SellRequestController {

    private final SellRequestService sellRequestService;

    public SellRequestController(SellRequestService sellRequestService) {
        this.sellRequestService = sellRequestService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SellRequestResponse create(
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String phoneCompany,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Integer conditionRating,
            @RequestParam(required = false) String storageCapacity,
            @RequestParam(required = false) SimStatus simStatus,
            @RequestParam(required = false) RepairStatus repairStatus,
            @RequestParam(required = false) AccessoriesIncluded accessories,
            @RequestParam(required = false) String deviceSerialNumber,
            @RequestParam(required = false) String deviceDetails,
            @RequestParam(required = false) BigDecimal expectedPriceRupees,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos,
            @RequestParam(value = "video", required = false) MultipartFile video
    ) {
        SellRequestCreateRequest request = new SellRequestCreateRequest(
                firstName, lastName, email, phoneNumber, phoneCompany, model,
                conditionRating, storageCapacity, simStatus, repairStatus, accessories,
                deviceSerialNumber, deviceDetails, expectedPriceRupees
        );
        return sellRequestService.create(request, photos, video);
    }
}
