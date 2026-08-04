package com.mobilevault.backend.controller;

import com.mobilevault.backend.dto.request.ComplaintCreateRequest;
import com.mobilevault.backend.dto.response.ComplaintResponse;
import com.mobilevault.backend.entity.ComplaintType;
import com.mobilevault.backend.service.ComplaintService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ComplaintResponse create(
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phoneNumber,
            @RequestParam(required = false) String orderNumber,
            @RequestParam(required = false) ComplaintType complaintType,
            @RequestParam(required = false) String description,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos,
            @RequestParam(value = "video", required = false) MultipartFile video
    ) {
        ComplaintCreateRequest request = new ComplaintCreateRequest(
                fullName, email, phoneNumber, orderNumber, complaintType, description
        );
        return complaintService.create(request, photos, video);
    }
}
