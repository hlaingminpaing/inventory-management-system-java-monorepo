package com.inventory.dto;

import lombok.Data;
import java.util.List;

@Data
public class DashboardResponseDto {
    private long totalProducts;
    private long totalCategories;
    private long lowStockCount;
    private long totalTransactions;
    private List<ProductResponseDto> lowStockProducts;
    private List<TransactionResponseDto> recentTransactions;
}
