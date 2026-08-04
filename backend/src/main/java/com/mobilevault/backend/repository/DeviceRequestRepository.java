package com.mobilevault.backend.repository;

import com.mobilevault.backend.entity.DeviceRequest;
import com.mobilevault.backend.entity.DeviceRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRequestRepository extends JpaRepository<DeviceRequest, Long> {
    Page<DeviceRequest> findByStatus(DeviceRequestStatus status, Pageable pageable);
}
