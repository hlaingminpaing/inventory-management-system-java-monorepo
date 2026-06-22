package com.inventory.dto;

import lombok.Data;

@Data
public class CategoryResponseDto {
    private Long id;
    private String name;
    private String description;
    private int productCount;
}
