package com.mobilevault.backend.service;

import com.mobilevault.backend.dto.mapper.OrderMapper;
import com.mobilevault.backend.dto.request.OrderCreateRequest;
import com.mobilevault.backend.dto.response.OrderResponse;
import com.mobilevault.backend.entity.Order;
import com.mobilevault.backend.entity.OrderStatus;
import com.mobilevault.backend.entity.Product;
import com.mobilevault.backend.entity.ProductStatus;
import com.mobilevault.backend.exception.BadRequestException;
import com.mobilevault.backend.exception.ResourceNotFoundException;
import com.mobilevault.backend.repository.OrderRepository;
import com.mobilevault.backend.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class OrderService {

    private static final BigDecimal ADVANCE_RATE = new BigDecimal("0.50");

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ImageStorageService imageStorageService;
    private final OrderMapper orderMapper;

    public OrderService(OrderRepository orderRepository,
                         ProductRepository productRepository,
                         ImageStorageService imageStorageService,
                         OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.imageStorageService = imageStorageService;
        this.orderMapper = orderMapper;
    }

    @Transactional
    public OrderResponse create(OrderCreateRequest request, MultipartFile paymentProof) {
        validate(request, paymentProof);

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new BadRequestException("This item is no longer available"));

        if (product.getStatus() != ProductStatus.AVAILABLE) {
            throw new BadRequestException("This item is no longer available");
        }

        Order order = new Order();
        order.setProduct(product);
        order.setProductTitle(product.getTitle());
        order.setProductPriceRupees(product.getPriceRupees());
        order.setAdvanceAmountRupees(product.getPriceRupees().multiply(ADVANCE_RATE).setScale(2, RoundingMode.HALF_UP));
        order.setCustomerFirstName(request.customerFirstName().trim());
        order.setCustomerLastName(request.customerLastName().trim());
        order.setCustomerEmail(request.customerEmail().trim());
        order.setCustomerPhone(request.customerPhone().trim());
        order.setDeliveryAddress(request.deliveryAddress().trim());
        order.setDeliveryCity(request.deliveryCity().trim());
        order.setDeliveryNotes(request.deliveryNotes() == null ? null : request.deliveryNotes().trim());
        order.setPaymentReference(request.paymentReference() == null ? null : request.paymentReference().trim());

        Order saved = orderRepository.save(order);

        String proofPath = imageStorageService.storeOrderPaymentProof(paymentProof, saved.getId());
        saved.setPaymentProofPath(proofPath);

        product.setStatus(ProductStatus.RESERVED);
        productRepository.save(product);

        return orderMapper.toResponse(orderRepository.save(saved));
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> list(OrderStatus status, Pageable pageable) {
        Page<Order> page = status == null
                ? orderRepository.findAll(pageable)
                : orderRepository.findByStatus(status, pageable);
        return page.map(orderMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse get(Long id) {
        return orderMapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public OrderResponse updateStatus(Long id, OrderStatus status) {
        Order order = findOrThrow(id);
        order.setStatus(status);

        if (status == OrderStatus.CANCELLED) {
            Product product = order.getProduct();
            if (product != null && product.getStatus() == ProductStatus.RESERVED) {
                product.setStatus(ProductStatus.AVAILABLE);
                productRepository.save(product);
            }
        }

        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Transactional
    public void delete(Long id) {
        Order order = findOrThrow(id);
        String proofPath = order.getPaymentProofPath();
        orderRepository.delete(order);
        if (proofPath != null) {
            imageStorageService.delete(proofPath);
        }
    }

    private Order findOrThrow(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    private void validate(OrderCreateRequest request, MultipartFile paymentProof) {
        if (request.productId() == null) throw new BadRequestException("productId is required");
        requireNonBlank(request.customerFirstName(), "customerFirstName");
        requireNonBlank(request.customerLastName(), "customerLastName");
        requireNonBlank(request.customerEmail(), "customerEmail");
        requireNonBlank(request.customerPhone(), "customerPhone");
        requireNonBlank(request.deliveryAddress(), "deliveryAddress");
        requireNonBlank(request.deliveryCity(), "deliveryCity");

        if (paymentProof == null || paymentProof.isEmpty()) {
            throw new BadRequestException("Payment proof screenshot is required");
        }
    }

    private void requireNonBlank(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new BadRequestException(field + " is required");
        }
    }
}
