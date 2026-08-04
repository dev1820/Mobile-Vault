package com.mobilevault.backend.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sell_requests")
@Getter
@Setter
@NoArgsConstructor
public class SellRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String phoneCompany;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Integer conditionRating;

    @Column(nullable = false)
    private String storageCapacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SimStatus simStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RepairStatus repairStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessoriesIncluded accessories;

    @Column(nullable = false)
    private String deviceSerialNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String deviceDetails;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal expectedPriceRupees;

    private String videoPath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SellRequestStatus status = SellRequestStatus.PENDING;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "sellRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<SellRequestImage> images = new ArrayList<>();

    public void addImage(SellRequestImage image) {
        images.add(image);
        image.setSellRequest(this);
    }
}
