package com.mobilevault.backend.dto.mapper;

import com.mobilevault.backend.dto.response.DeviceRequestResponse;
import com.mobilevault.backend.entity.DeviceRequest;
import org.springframework.stereotype.Component;

@Component
public class DeviceRequestMapper {

    public DeviceRequestResponse toResponse(DeviceRequest request) {
        return new DeviceRequestResponse(
                request.getId(),
                request.getCategory(),
                request.getItemName(),
                request.getDetails(),
                request.getBudgetRupees(),
                request.getCustomerName(),
                request.getCustomerPhone(),
                request.getCustomerEmail(),
                request.getStatus(),
                request.getCreatedAt(),
                request.getUpdatedAt()
        );
    }
}
