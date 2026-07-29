package com.mobilevault.backend.dto.mapper;

import com.mobilevault.backend.dto.response.ProductImageResponse;
import com.mobilevault.backend.dto.response.ProductResponse;
import com.mobilevault.backend.entity.Product;
import com.mobilevault.backend.entity.ProductImage;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
        List<ProductImageResponse> images = product.getImages().stream()
                .map(this::toImageResponse)
                .toList();

        return new ProductResponse(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getCategory(),
                product.getModel(),
                product.getStorageCapacity(),
                product.getColor(),
                product.getCondition(),
                product.getPriceRupees(),
                product.getBatteryHealthPercent(),
                product.getStatus(),
                product.getCreatedAt(),
                product.getUpdatedAt(),
                images
        );
    }

    public ProductImageResponse toImageResponse(ProductImage image) {
        return new ProductImageResponse(image.getId(), "/uploads/" + image.getFilePath(), image.getSortOrder());
    }
}
