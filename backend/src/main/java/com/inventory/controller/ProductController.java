package com.inventory.controller;

import com.inventory.dto.ProductRequestDto;
import com.inventory.dto.ProductResponseDto;
import com.inventory.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product management endpoints")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products")
    public ResponseEntity<List<ProductResponseDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new product")
    public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody ProductRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequestDto request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
