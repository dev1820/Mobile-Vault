package com.mobilevault.backend.dto.mapper;

import com.mobilevault.backend.dto.response.ComplaintImageResponse;
import com.mobilevault.backend.dto.response.ComplaintResponse;
import com.mobilevault.backend.entity.Complaint;
import com.mobilevault.backend.entity.ComplaintImage;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ComplaintMapper {

    public ComplaintResponse toResponse(Complaint complaint) {
        List<ComplaintImageResponse> images = complaint.getImages().stream()
                .map(this::toImageResponse)
                .toList();

        String videoUrl = complaint.getVideoPath();

        return new ComplaintResponse(
                complaint.getId(),
                complaint.getFullName(),
                complaint.getEmail(),
                complaint.getPhoneNumber(),
                complaint.getOrderNumber(),
                complaint.getComplaintType(),
                complaint.getDescription(),
                videoUrl,
                complaint.getStatus(),
                complaint.getCreatedAt(),
                complaint.getUpdatedAt(),
                images
        );
    }

    public ComplaintImageResponse toImageResponse(ComplaintImage image) {
        return new ComplaintImageResponse(image.getId(), image.getFilePath(), image.getSortOrder());
    }
}
