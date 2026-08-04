package com.mobilevault.backend.controller;

import com.mobilevault.backend.dto.request.DeviceRequestCreateRequest;
import com.mobilevault.backend.dto.response.DeviceRequestResponse;
import com.mobilevault.backend.service.DeviceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/device-requests")
public class DeviceRequestController {

    private final DeviceRequestService deviceRequestService;

    public DeviceRequestController(DeviceRequestService deviceRequestService) {
        this.deviceRequestService = deviceRequestService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DeviceRequestResponse create(@Valid @RequestBody DeviceRequestCreateRequest request) {
        return deviceRequestService.create(request);
    }
}
