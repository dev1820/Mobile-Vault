package com.mobilevault.backend.controller;

import com.mobilevault.backend.dto.request.DeviceRequestStatusUpdateRequest;
import com.mobilevault.backend.dto.response.DeviceRequestResponse;
import com.mobilevault.backend.entity.DeviceRequestStatus;
import com.mobilevault.backend.service.DeviceRequestService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/device-requests")
public class AdminDeviceRequestController {

    private final DeviceRequestService deviceRequestService;

    public AdminDeviceRequestController(DeviceRequestService deviceRequestService) {
        this.deviceRequestService = deviceRequestService;
    }

    @GetMapping
    public Page<DeviceRequestResponse> list(
            @RequestParam(required = false) DeviceRequestStatus status,
            @PageableDefault(size = 200, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return deviceRequestService.list(status, pageable);
    }

    @GetMapping("/{id}")
    public DeviceRequestResponse get(@PathVariable Long id) {
        return deviceRequestService.get(id);
    }

    @PatchMapping("/{id}/status")
    public DeviceRequestResponse updateStatus(@PathVariable Long id, @Valid @RequestBody DeviceRequestStatusUpdateRequest request) {
        return deviceRequestService.updateStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        deviceRequestService.delete(id);
    }
}
