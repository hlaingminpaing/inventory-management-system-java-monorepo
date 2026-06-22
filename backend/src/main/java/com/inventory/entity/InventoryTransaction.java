package com.inventory.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionType transactionType;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(length = 500)
    private String notes;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum TransactionType {
        IN, OUT, ADJUSTMENT
    }
}
