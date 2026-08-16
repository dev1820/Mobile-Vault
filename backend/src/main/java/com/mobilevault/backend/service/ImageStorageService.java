package com.mobilevault.backend.service;

import com.mobilevault.backend.exception.BadRequestException;
import com.mobilevault.backend.exception.FileStorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@Service
public class ImageStorageService {

    private static final Logger log = LoggerFactory.getLogger(ImageStorageService.class);
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
    private static final Set<String> ALLOWED_VIDEO_EXTENSIONS = Set.of("mp4", "mov", "m4v", "webm");

    private final RestClient restClient;
    private final String supabaseUrl;
    private final String bucket;

    public ImageStorageService(
            @Value("${app.supabase.url}") String supabaseUrl,
            @Value("${app.supabase.service-role-key}") String serviceRoleKey,
            @Value("${app.supabase.storage-bucket}") String bucket
    ) {
        this.supabaseUrl = supabaseUrl;
        this.bucket = bucket;
        this.restClient = RestClient.builder()
                .baseUrl(supabaseUrl + "/storage/v1")
                .defaultHeader("Authorization", "Bearer " + serviceRoleKey)
                .defaultHeader("apikey", serviceRoleKey)
                .build();
    }

    public String store(MultipartFile file, Long productId) {
        return storeInternal(file, "products/" + productId, ALLOWED_EXTENSIONS);
    }

    public String storeSellRequestImage(MultipartFile file, Long sellRequestId) {
        return storeInternal(file, "sell-requests/" + sellRequestId, ALLOWED_EXTENSIONS);
    }

    public String storeSellRequestVideo(MultipartFile file, Long sellRequestId) {
        return storeInternal(file, "sell-requests/" + sellRequestId, ALLOWED_VIDEO_EXTENSIONS);
    }

    public String storeOrderPaymentProof(MultipartFile file, Long orderId) {
        return storeInternal(file, "orders/" + orderId, ALLOWED_EXTENSIONS);
    }

    public String storeComplaintImage(MultipartFile file, Long complaintId) {
        return storeInternal(file, "complaints/" + complaintId, ALLOWED_EXTENSIONS);
    }

    public String storeComplaintVideo(MultipartFile file, Long complaintId) {
        return storeInternal(file, "complaints/" + complaintId, ALLOWED_VIDEO_EXTENSIONS);
    }

    private String storeInternal(MultipartFile file, String subDir, Set<String> allowedExtensions) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String extension = getExtension(originalFilename);

        if (!allowedExtensions.contains(extension)) {
            throw new BadRequestException("Unsupported file type: " + extension + ". Allowed: " + allowedExtensions);
        }

        String storedFilename = UUID.randomUUID() + "." + extension;
        String objectPath = subDir + "/" + storedFilename;

        try {
            byte[] bytes = file.getInputStream().readAllBytes();
            restClient.post()
                    .uri("/object/{bucket}/{path}", bucket, objectPath)
                    .contentType(MediaType.parseMediaType(resolveContentType(extension)))
                    .body(bytes)
                    .retrieve()
                    .toBodilessEntity();
            return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + objectPath;
        } catch (IOException e) {
            throw new FileStorageException("Failed to read uploaded file: " + originalFilename, e);
        } catch (RestClientException e) {
            throw new FileStorageException("Failed to upload file to storage: " + originalFilename, e);
        }
    }

    public void delete(String fileUrl) {
        String objectPath = extractObjectPath(fileUrl);
        if (objectPath == null) {
            return;
        }
        try {
            restClient.delete()
                    .uri("/object/{bucket}/{path}", bucket, objectPath)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException e) {
            log.warn("Failed to delete storage object {}: {}", objectPath, e.getMessage());
        }
    }

    private String extractObjectPath(String fileUrl) {
        String marker = "/storage/v1/object/public/" + bucket + "/";
        int index = fileUrl.indexOf(marker);
        if (index < 0) {
            return null;
        }
        return fileUrl.substring(index + marker.length());
    }

    private String resolveContentType(String extension) {
        return switch (extension) {
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "webp" -> "image/webp";
            case "mp4" -> "video/mp4";
            case "mov" -> "video/quicktime";
            case "m4v" -> "video/x-m4v";
            case "webm" -> "video/webm";
            default -> "application/octet-stream";
        };
    }

    private String getExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == filename.length() - 1) {
            throw new BadRequestException("Uploaded file is missing an extension");
        }
        return filename.substring(dotIndex + 1).toLowerCase();
    }
}
