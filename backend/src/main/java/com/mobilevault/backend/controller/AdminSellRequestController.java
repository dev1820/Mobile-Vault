package com.mobilevault.backend.controller;

import com.mobilevault.backend.dto.request.SellRequestStatusUpdateRequest;
import com.mobilevault.backend.dto.response.SellRequestResponse;
import com.mobilevault.backend.entity.SellRequestStatus;
import com.mobilevault.backend.service.SellRequestService;
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
@RequestMapping("/api/admin/sell-requests")
public class AdminSellRequestController {

    private final SellRequestService sellRequestService;

    public AdminSellRequestController(SellRequestService sellRequestService) {
        this.sellRequestService = sellRequestService;
    }

    @GetMapping
    public Page<SellRequestResponse> list(
            @RequestParam(required = false) SellRequestStatus status,
            @PageableDefault(size = 200, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return sellRequestService.list(status, pageable);
    }

    @GetMapping("/{id}")
    public SellRequestResponse get(@PathVariable Long id) {
        return sellRequestService.get(id);
    }

    @PatchMapping("/{id}/status")
    public SellRequestResponse updateStatus(@PathVariable Long id, @Valid @RequestBody SellRequestStatusUpdateRequest request) {
        return sellRequestService.updateStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        sellRequestService.delete(id);
    }
}
