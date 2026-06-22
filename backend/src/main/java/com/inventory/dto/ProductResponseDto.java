package com.inventory.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductResponseDto {
    private Long id;
    private String sku;
    private String name;
    private Integer quantity;
    private Integer minimumStock;
    private BigDecimal price;
    private Long categoryId;
    private String categoryName;
    private boolean lowStock;
}
