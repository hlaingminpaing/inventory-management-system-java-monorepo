package com.inventory.dto;

import com.inventory.entity.InventoryTransaction;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class TransactionRequestDto {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Transaction type is required")
    private InventoryTransaction.TransactionType transactionType;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String notes;
}
