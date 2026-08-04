package com.mobilevault.backend.controller;

import com.mobilevault.backend.dto.request.ComplaintStatusUpdateRequest;
import com.mobilevault.backend.dto.response.ComplaintResponse;
import com.mobilevault.backend.entity.ComplaintStatus;
import com.mobilevault.backend.service.ComplaintService;
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
@RequestMapping("/api/admin/complaints")
public class AdminComplaintController {

    private final ComplaintService complaintService;

    public AdminComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping
    public Page<ComplaintResponse> list(
            @RequestParam(required = false) ComplaintStatus status,
            @PageableDefault(size = 200, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return complaintService.list(status, pageable);
    }

    @GetMapping("/{id}")
    public ComplaintResponse get(@PathVariable Long id) {
        return complaintService.get(id);
    }

    @PatchMapping("/{id}/status")
    public ComplaintResponse updateStatus(@PathVariable Long id, @Valid @RequestBody ComplaintStatusUpdateRequest request) {
        return complaintService.updateStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        complaintService.delete(id);
    }
}
