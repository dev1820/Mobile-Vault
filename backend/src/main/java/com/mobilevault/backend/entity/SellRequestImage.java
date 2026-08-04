package com.mobilevault.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sell_request_images")
@Getter
@Setter
@NoArgsConstructor
public class SellRequestImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sell_request_id", nullable = false)
    private SellRequest sellRequest;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private Integer sortOrder = 0;

    public SellRequestImage(String filePath, Integer sortOrder) {
        this.filePath = filePath;
        this.sortOrder = sortOrder;
    }
}
