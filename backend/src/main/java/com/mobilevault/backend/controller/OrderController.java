package com.mobilevault.backend.controller;

import com.mobilevault.backend.dto.request.OrderCreateRequest;
import com.mobilevault.backend.dto.response.OrderResponse;
import com.mobilevault.backend.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) String customerFirstName,
            @RequestParam(required = false) String customerLastName,
            @RequestParam(required = false) String customerEmail,
            @RequestParam(required = false) String customerPhone,
            @RequestParam(required = false) String deliveryAddress,
            @RequestParam(required = false) String deliveryCity,
            @RequestParam(required = false) String deliveryNotes,
            @RequestParam(required = false) String paymentReference,
            @RequestParam(value = "paymentProof", required = false) MultipartFile paymentProof
    ) {
        OrderCreateRequest request = new OrderCreateRequest(
                productId, customerFirstName, customerLastName, customerEmail, customerPhone,
                deliveryAddress, deliveryCity, deliveryNotes, paymentReference
        );
        return orderService.create(request, paymentProof);
    }
}
