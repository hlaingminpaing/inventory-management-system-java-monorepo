package com.inventory.service;

import com.inventory.dto.ProductRequestDto;
import com.inventory.dto.ProductResponseDto;
import com.inventory.entity.Category;
import com.inventory.entity.Product;
import com.inventory.exception.ConflictException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<ProductResponseDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return toResponseDto(product);
    }

    public ProductResponseDto createProduct(ProductRequestDto request) {
        if (productRepository.existsBySku(request.getSku())) {
            throw new ConflictException("Product with SKU '" + request.getSku() + "' already exists");
        }
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = Product.builder()
                .sku(request.getSku())
                .name(request.getName())
                .quantity(request.getQuantity())
                .minimumStock(request.getMinimumStock())
                .price(request.getPrice())
                .category(category)
                .build();
        return toResponseDto(productRepository.save(product));
    }

    public ProductResponseDto updateProduct(Long id, ProductRequestDto request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (productRepository.existsBySkuAndIdNot(request.getSku(), id)) {
            throw new ConflictException("Product with SKU '" + request.getSku() + "' already exists");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setQuantity(request.getQuantity());
        product.setMinimumStock(request.getMinimumStock());
        product.setPrice(request.getPrice());
        product.setCategory(category);

        return toResponseDto(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDto> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
                .map(this::toResponseDto)
                .toList();
    }

    public ProductResponseDto toResponseDto(Product product) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setSku(product.getSku());
        dto.setName(product.getName());
        dto.setQuantity(product.getQuantity());
        dto.setMinimumStock(product.getMinimumStock());
        dto.setPrice(product.getPrice());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        dto.setLowStock(product.getQuantity() <= product.getMinimumStock());
        return dto;
    }
}
