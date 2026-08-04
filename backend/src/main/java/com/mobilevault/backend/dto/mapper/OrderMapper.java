package com.mobilevault.backend.dto.mapper;

import com.mobilevault.backend.dto.response.OrderResponse;
import com.mobilevault.backend.entity.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getProduct() != null ? order.getProduct().getId() : null,
                order.getProductTitle(),
                order.getProductPriceRupees(),
                order.getAdvanceAmountRupees(),
                order.getCustomerFirstName(),
                order.getCustomerLastName(),
                order.getCustomerEmail(),
                order.getCustomerPhone(),
                order.getDeliveryAddress(),
                order.getDeliveryCity(),
                order.getDeliveryNotes(),
                "/uploads/" + order.getPaymentProofPath(),
                order.getPaymentReference(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}
