package com.mobilevault.backend.service;

import com.mobilevault.backend.dto.mapper.SellRequestMapper;
import com.mobilevault.backend.dto.request.SellRequestCreateRequest;
import com.mobilevault.backend.dto.response.SellRequestResponse;
import com.mobilevault.backend.entity.SellRequest;
import com.mobilevault.backend.entity.SellRequestImage;
import com.mobilevault.backend.entity.SellRequestStatus;
import com.mobilevault.backend.exception.BadRequestException;
import com.mobilevault.backend.exception.ResourceNotFoundException;
import com.mobilevault.backend.repository.SellRequestRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Service
public class SellRequestService {

    private final SellRequestRepository sellRequestRepository;
    private final ImageStorageService imageStorageService;
    private final SellRequestMapper sellRequestMapper;

    public SellRequestService(SellRequestRepository sellRequestRepository,
                               ImageStorageService imageStorageService,
                               SellRequestMapper sellRequestMapper) {
        this.sellRequestRepository = sellRequestRepository;
        this.imageStorageService = imageStorageService;
        this.sellRequestMapper = sellRequestMapper;
    }

    @Transactional
    public SellRequestResponse create(SellRequestCreateRequest request, List<MultipartFile> photos, MultipartFile video) {
        validate(request, photos);

        SellRequest sellRequest = new SellRequest();
        sellRequest.setFirstName(request.firstName().trim());
        sellRequest.setLastName(request.lastName().trim());
        sellRequest.setEmail(request.email().trim());
        sellRequest.setPhoneNumber(request.phoneNumber().trim());
        sellRequest.setPhoneCompany(request.phoneCompany().trim());
        sellRequest.setModel(request.model().trim());
        sellRequest.setConditionRating(request.conditionRating());
        sellRequest.setStorageCapacity(request.storageCapacity().trim());
        sellRequest.setSimStatus(request.simStatus());
        sellRequest.setRepairStatus(request.repairStatus());
        sellRequest.setAccessories(request.accessories());
        sellRequest.setDeviceSerialNumber(request.deviceSerialNumber().trim());
        sellRequest.setDeviceDetails(request.deviceDetails().trim());
        sellRequest.setExpectedPriceRupees(request.expectedPriceRupees());

        SellRequest saved = sellRequestRepository.save(sellRequest);

        int sortOrder = 0;
        for (MultipartFile photo : photos) {
            String relativePath = imageStorageService.storeSellRequestImage(photo, saved.getId());
            saved.addImage(new SellRequestImage(relativePath, sortOrder++));
        }

        if (video != null && !video.isEmpty()) {
            saved.setVideoPath(imageStorageService.storeSellRequestVideo(video, saved.getId()));
        }

        return sellRequestMapper.toResponse(sellRequestRepository.save(saved));
    }

    @Transactional(readOnly = true)
    public Page<SellRequestResponse> list(SellRequestStatus status, Pageable pageable) {
        Page<SellRequest> page = status == null
                ? sellRequestRepository.findAll(pageable)
                : sellRequestRepository.findByStatus(status, pageable);
        return page.map(sellRequestMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public SellRequestResponse get(Long id) {
        return sellRequestMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public SellRequestResponse updateStatus(Long id, SellRequestStatus status) {
        SellRequest sellRequest = findOrThrow(id);
        sellRequest.setStatus(status);
        return sellRequestMapper.toResponse(sellRequestRepository.save(sellRequest));
    }

    @Transactional
    public void delete(Long id) {
        SellRequest sellRequest = findOrThrow(id);
        List<String> filePaths = sellRequest.getImages().stream().map(SellRequestImage::getFilePath).toList();
        String videoPath = sellRequest.getVideoPath();

        sellRequestRepository.delete(sellRequest);

        filePaths.forEach(imageStorageService::delete);
        if (videoPath != null) {
            imageStorageService.delete(videoPath);
        }
    }

    private SellRequest findOrThrow(Long id) {
        return sellRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sell request not found: " + id));
    }

    private void validate(SellRequestCreateRequest request, List<MultipartFile> photos) {
        requireNonBlank(request.firstName(), "firstName");
        requireNonBlank(request.lastName(), "lastName");
        requireNonBlank(request.email(), "email");
        requireNonBlank(request.phoneNumber(), "phoneNumber");
        requireNonBlank(request.phoneCompany(), "phoneCompany");
        requireNonBlank(request.model(), "model");
        requireNonBlank(request.storageCapacity(), "storageCapacity");
        requireNonBlank(request.deviceSerialNumber(), "deviceSerialNumber");
        requireNonBlank(request.deviceDetails(), "deviceDetails");

        if (request.simStatus() == null) throw new BadRequestException("simStatus is required");
        if (request.repairStatus() == null) throw new BadRequestException("repairStatus is required");
        if (request.accessories() == null) throw new BadRequestException("accessories is required");

        if (request.conditionRating() == null || request.conditionRating() < 1 || request.conditionRating() > 10) {
            throw new BadRequestException("conditionRating must be between 1 and 10");
        }

        if (request.expectedPriceRupees() == null || request.expectedPriceRupees().compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("expectedPriceRupees must be 0 or more");
        }

        if (photos == null || photos.isEmpty() || photos.stream().allMatch(MultipartFile::isEmpty)) {
            throw new BadRequestException("At least one photo is required");
        }
    }

    private void requireNonBlank(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new BadRequestException(field + " is required");
        }
    }
}
