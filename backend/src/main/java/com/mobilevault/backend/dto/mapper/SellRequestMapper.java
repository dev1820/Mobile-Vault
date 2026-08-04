package com.mobilevault.backend.dto.mapper;

import com.mobilevault.backend.dto.response.SellRequestImageResponse;
import com.mobilevault.backend.dto.response.SellRequestResponse;
import com.mobilevault.backend.entity.SellRequest;
import com.mobilevault.backend.entity.SellRequestImage;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SellRequestMapper {

    public SellRequestResponse toResponse(SellRequest sellRequest) {
        List<SellRequestImageResponse> images = sellRequest.getImages().stream()
                .map(this::toImageResponse)
                .toList();

        String videoUrl = sellRequest.getVideoPath() == null ? null : "/uploads/" + sellRequest.getVideoPath();

        return new SellRequestResponse(
                sellRequest.getId(),
                sellRequest.getFirstName(),
                sellRequest.getLastName(),
                sellRequest.getEmail(),
                sellRequest.getPhoneNumber(),
                sellRequest.getPhoneCompany(),
                sellRequest.getModel(),
                sellRequest.getConditionRating(),
                sellRequest.getStorageCapacity(),
                sellRequest.getSimStatus(),
                sellRequest.getRepairStatus(),
                sellRequest.getAccessories(),
                sellRequest.getDeviceSerialNumber(),
                sellRequest.getDeviceDetails(),
                sellRequest.getExpectedPriceRupees(),
                videoUrl,
                sellRequest.getStatus(),
                sellRequest.getCreatedAt(),
                sellRequest.getUpdatedAt(),
                images
        );
    }

    public SellRequestImageResponse toImageResponse(SellRequestImage image) {
        return new SellRequestImageResponse(image.getId(), "/uploads/" + image.getFilePath(), image.getSortOrder());
    }
}
