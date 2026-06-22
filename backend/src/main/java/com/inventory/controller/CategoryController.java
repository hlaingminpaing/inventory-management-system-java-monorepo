package com.inventory.controller;

import com.inventory.dto.CategoryRequestDto;
import com.inventory.dto.CategoryResponseDto;
import com.inventory.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Category management endpoints")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all categories")
    public ResponseEntity<List<CategoryResponseDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    public ResponseEntity<CategoryResponseDto> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new category")
    public ResponseEntity<CategoryResponseDto> createCategory(@Valid @RequestBody CategoryRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(request));
    }
}
