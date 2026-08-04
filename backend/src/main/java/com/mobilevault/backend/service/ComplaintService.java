package com.mobilevault.backend.service;

import com.mobilevault.backend.dto.mapper.ComplaintMapper;
import com.mobilevault.backend.dto.request.ComplaintCreateRequest;
import com.mobilevault.backend.dto.response.ComplaintResponse;
import com.mobilevault.backend.entity.Complaint;
import com.mobilevault.backend.entity.ComplaintImage;
import com.mobilevault.backend.entity.ComplaintStatus;
import com.mobilevault.backend.exception.BadRequestException;
import com.mobilevault.backend.exception.ResourceNotFoundException;
import com.mobilevault.backend.repository.ComplaintRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ImageStorageService imageStorageService;
    private final ComplaintMapper complaintMapper;

    public ComplaintService(ComplaintRepository complaintRepository,
                             ImageStorageService imageStorageService,
                             ComplaintMapper complaintMapper) {
        this.complaintRepository = complaintRepository;
        this.imageStorageService = imageStorageService;
        this.complaintMapper = complaintMapper;
    }

    @Transactional
    public ComplaintResponse create(ComplaintCreateRequest request, List<MultipartFile> photos, MultipartFile video) {
        validate(request);

        Complaint complaint = new Complaint();
        complaint.setFullName(request.fullName().trim());
        complaint.setEmail(request.email().trim());
        complaint.setPhoneNumber(request.phoneNumber().trim());
        complaint.setOrderNumber(request.orderNumber().trim());
        complaint.setComplaintType(request.complaintType());
        complaint.setDescription(request.description().trim());

        Complaint saved = complaintRepository.save(complaint);

        if (photos != null) {
            int sortOrder = 0;
            for (MultipartFile photo : photos) {
                if (photo == null || photo.isEmpty()) continue;
                String relativePath = imageStorageService.storeComplaintImage(photo, saved.getId());
                saved.addImage(new ComplaintImage(relativePath, sortOrder++));
            }
        }

        if (video != null && !video.isEmpty()) {
            saved.setVideoPath(imageStorageService.storeComplaintVideo(video, saved.getId()));
        }

        return complaintMapper.toResponse(complaintRepository.save(saved));
    }

    @Transactional(readOnly = true)
    public Page<ComplaintResponse> list(ComplaintStatus status, Pageable pageable) {
        Page<Complaint> page = status == null
                ? complaintRepository.findAll(pageable)
                : complaintRepository.findByStatus(status, pageable);
        return page.map(complaintMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ComplaintResponse get(Long id) {
        return complaintMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public ComplaintResponse updateStatus(Long id, ComplaintStatus status) {
        Complaint complaint = findOrThrow(id);
        complaint.setStatus(status);
        return complaintMapper.toResponse(complaintRepository.save(complaint));
    }

    @Transactional
    public void delete(Long id) {
        Complaint complaint = findOrThrow(id);
        List<String> filePaths = complaint.getImages().stream().map(ComplaintImage::getFilePath).toList();
        String videoPath = complaint.getVideoPath();

        complaintRepository.delete(complaint);

        filePaths.forEach(imageStorageService::delete);
        if (videoPath != null) {
            imageStorageService.delete(videoPath);
        }
    }

    private Complaint findOrThrow(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found: " + id));
    }

    private void validate(ComplaintCreateRequest request) {
        requireNonBlank(request.fullName(), "fullName");
        requireNonBlank(request.email(), "email");
        requireNonBlank(request.phoneNumber(), "phoneNumber");
        requireNonBlank(request.orderNumber(), "orderNumber");
        requireNonBlank(request.description(), "description");

        if (request.complaintType() == null) {
            throw new BadRequestException("complaintType is required");
        }
    }

    private void requireNonBlank(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new BadRequestException(field + " is required");
        }
    }
}
