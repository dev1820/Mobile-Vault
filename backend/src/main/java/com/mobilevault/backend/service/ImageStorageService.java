package com.mobilevault.backend.service;

import com.mobilevault.backend.exception.BadRequestException;
import com.mobilevault.backend.exception.FileStorageException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class ImageStorageService {

    private static final Logger log = LoggerFactory.getLogger(ImageStorageService.class);
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");

    private final Path uploadRoot;

    public ImageStorageService(@Value("${app.upload-dir}") String uploadDir) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadRoot);
        } catch (IOException e) {
            throw new FileStorageException("Could not create upload directory: " + uploadRoot, e);
        }
    }

    public String store(MultipartFile file, Long productId) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String extension = getExtension(originalFilename);

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Unsupported image type: " + extension + ". Allowed: " + ALLOWED_EXTENSIONS);
        }

        String storedFilename = UUID.randomUUID() + "." + extension;
        String relativePath = "products/" + productId + "/" + storedFilename;

        try {
            Path targetPath = uploadRoot.resolve(relativePath).normalize();
            if (!targetPath.startsWith(uploadRoot)) {
                throw new BadRequestException("Invalid file path");
            }
            Files.createDirectories(targetPath.getParent());
            Files.copy(file.getInputStream(), targetPath);
            return relativePath;
        } catch (IOException e) {
            throw new FileStorageException("Failed to store file: " + originalFilename, e);
        }
    }

    public void delete(String relativePath) {
        try {
            Path targetPath = uploadRoot.resolve(relativePath).normalize();
            if (!targetPath.startsWith(uploadRoot)) {
                return;
            }
            Files.deleteIfExists(targetPath);
        } catch (IOException e) {
            log.warn("Failed to delete image file {}: {}", relativePath, e.getMessage());
        }
    }

    private String getExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == filename.length() - 1) {
            throw new BadRequestException("Uploaded file is missing an extension");
        }
        return filename.substring(dotIndex + 1).toLowerCase();
    }
}
