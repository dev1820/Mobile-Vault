package com.mobilevault.backend.repository;

import com.mobilevault.backend.entity.SellRequest;
import com.mobilevault.backend.entity.SellRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellRequestRepository extends JpaRepository<SellRequest, Long> {
    Page<SellRequest> findByStatus(SellRequestStatus status, Pageable pageable);
}
