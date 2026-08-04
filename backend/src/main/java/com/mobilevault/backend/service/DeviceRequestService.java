package com.mobilevault.backend.service;

import com.mobilevault.backend.dto.mapper.DeviceRequestMapper;
import com.mobilevault.backend.dto.request.DeviceRequestCreateRequest;
import com.mobilevault.backend.dto.response.DeviceRequestResponse;
import com.mobilevault.backend.entity.DeviceRequest;
import com.mobilevault.backend.entity.DeviceRequestStatus;
import com.mobilevault.backend.exception.ResourceNotFoundException;
import com.mobilevault.backend.repository.DeviceRequestRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeviceRequestService {

    private final DeviceRequestRepository deviceRequestRepository;
    private final DeviceRequestMapper deviceRequestMapper;

    public DeviceRequestService(DeviceRequestRepository deviceRequestRepository, DeviceRequestMapper deviceRequestMapper) {
        this.deviceRequestRepository = deviceRequestRepository;
        this.deviceRequestMapper = deviceRequestMapper;
    }

    @Transactional
    public DeviceRequestResponse create(DeviceRequestCreateRequest request) {
        DeviceRequest deviceRequest = new DeviceRequest();
        deviceRequest.setCategory(request.category());
        deviceRequest.setItemName(request.itemName().trim());
        deviceRequest.setDetails(request.details().trim());
        deviceRequest.setBudgetRupees(request.budgetRupees());
        deviceRequest.setCustomerName(request.customerName().trim());
        deviceRequest.setCustomerPhone(request.customerPhone().trim());
        deviceRequest.setCustomerEmail(request.customerEmail().trim());

        return deviceRequestMapper.toResponse(deviceRequestRepository.save(deviceRequest));
    }

    @Transactional(readOnly = true)
    public Page<DeviceRequestResponse> list(DeviceRequestStatus status, Pageable pageable) {
        Page<DeviceRequest> page = status == null
                ? deviceRequestRepository.findAll(pageable)
                : deviceRequestRepository.findByStatus(status, pageable);
        return page.map(deviceRequestMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public DeviceRequestResponse get(Long id) {
        return deviceRequestMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public DeviceRequestResponse updateStatus(Long id, DeviceRequestStatus status) {
        DeviceRequest deviceRequest = findOrThrow(id);
        deviceRequest.setStatus(status);
        return deviceRequestMapper.toResponse(deviceRequestRepository.save(deviceRequest));
    }

    @Transactional
    public void delete(Long id) {
        deviceRequestRepository.delete(findOrThrow(id));
    }

    private DeviceRequest findOrThrow(Long id) {
        return deviceRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device request not found: " + id));
    }
}
