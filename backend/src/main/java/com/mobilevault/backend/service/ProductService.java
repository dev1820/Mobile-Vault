package com.mobilevault.backend.service;

import com.mobilevault.backend.dto.mapper.ProductMapper;
import com.mobilevault.backend.dto.request.ProductCreateRequest;
import com.mobilevault.backend.dto.request.ProductUpdateRequest;
import com.mobilevault.backend.dto.response.ProductResponse;
import com.mobilevault.backend.entity.Product;
import com.mobilevault.backend.entity.ProductCategory;
import com.mobilevault.backend.entity.ProductImage;
import com.mobilevault.backend.entity.ProductStatus;
import com.mobilevault.backend.exception.BadRequestException;
import com.mobilevault.backend.exception.ResourceNotFoundException;
import com.mobilevault.backend.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ImageStorageService imageStorageService;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository,
                           ImageStorageService imageStorageService,
                           ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.imageStorageService = imageStorageService;
        this.productMapper = productMapper;
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> list(ProductCategory category, ProductStatus status, String search,
                                       BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Specification<Product> spec = buildSpecification(category, status, search, minPrice, maxPrice);
        return productRepository.findAll(spec, pageable).map(productMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse get(Long id) {
        return productMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public ProductResponse create(ProductCreateRequest request) {
        Product product = new Product();
        applyFields(product, request.title(), request.description(), request.category(), request.model(),
                request.storageCapacity(), request.color(), request.condition(), request.priceRupees(),
                request.batteryHealthPercent());
        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductUpdateRequest request) {
        Product product = findOrThrow(id);
        applyFields(product, request.title(), request.description(), request.category(), request.model(),
                request.storageCapacity(), request.color(), request.condition(), request.priceRupees(),
                request.batteryHealthPercent());
        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateStatus(Long id, ProductStatus status) {
        Product product = findOrThrow(id);
        product.setStatus(status);
        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = findOrThrow(id);
        List<String> filePaths = product.getImages().stream().map(ProductImage::getFilePath).toList();
        productRepository.delete(product);
        filePaths.forEach(imageStorageService::delete);
    }

    @Transactional
    public ProductResponse addImages(Long id, List<MultipartFile> files) {
        Product product = findOrThrow(id);

        if (files == null || files.isEmpty()) {
            throw new BadRequestException("At least one image file is required");
        }

        int nextSortOrder = product.getImages().stream()
                .mapToInt(ProductImage::getSortOrder)
                .max()
                .orElse(-1) + 1;

        for (MultipartFile file : files) {
            String relativePath = imageStorageService.store(file, product.getId());
            product.addImage(new ProductImage(relativePath, nextSortOrder++));
        }

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse deleteImage(Long id, Long imageId) {
        Product product = findOrThrow(id);
        ProductImage image = product.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Image not found: " + imageId));

        product.removeImage(image);
        productRepository.save(product);
        imageStorageService.delete(image.getFilePath());

        return productMapper.toResponse(product);
    }

    private Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    private void applyFields(Product product, String title, String description, ProductCategory category,
                              String model, String storageCapacity, String color,
                              com.mobilevault.backend.entity.ProductCondition condition,
                              BigDecimal priceRupees, Integer batteryHealthPercent) {
        product.setTitle(title);
        product.setDescription(description);
        product.setCategory(category);
        product.setModel(model);
        product.setStorageCapacity(storageCapacity);
        product.setColor(color);
        product.setCondition(condition);
        product.setPriceRupees(priceRupees);
        product.setBatteryHealthPercent(batteryHealthPercent);
    }

    private Specification<Product> buildSpecification(ProductCategory category, ProductStatus status, String search,
                                                        BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("model")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("priceRupees"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("priceRupees"), maxPrice));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
