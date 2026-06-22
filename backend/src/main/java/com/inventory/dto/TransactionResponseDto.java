package com.inventory.dto;

import com.inventory.entity.InventoryTransaction;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TransactionResponseDto {
    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private InventoryTransaction.TransactionType transactionType;
    private Integer quantity;
    private LocalDateTime createdAt;
    private String notes;
}
