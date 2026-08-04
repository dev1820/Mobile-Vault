package com.mobilevault.backend.repository;

import com.mobilevault.backend.entity.Complaint;
import com.mobilevault.backend.entity.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Page<Complaint> findByStatus(ComplaintStatus status, Pageable pageable);
}
