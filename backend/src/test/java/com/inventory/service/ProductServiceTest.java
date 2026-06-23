package com.inventory.service;

import com.inventory.dto.ProductRequestDto;
import com.inventory.dto.ProductResponseDto;
import com.inventory.entity.Category;
import com.inventory.entity.Product;
import com.inventory.exception.ConflictException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void getAllProductsMapsLowStockFlag() {
        when(productRepository.findAll()).thenReturn(List.of(product(1L, "SKU-1", 3, 5)));

        List<ProductResponseDto> result = productService.getAllProducts();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getSku()).isEqualTo("SKU-1");
        assertThat(result.get(0).getCategoryName()).isEqualTo("Electronics");
        assertThat(result.get(0).isLowStock()).isTrue();
    }

    @Test
    void createProductSavesWhenSkuAndCategoryAreValid() {
        ProductRequestDto request = request("SKU-2", 10, 4);
        when(productRepository.existsBySku("SKU-2")).thenReturn(false);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category()));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product product = invocation.getArgument(0);
            product.setId(2L);
            return product;
        });

        ProductResponseDto result = productService.createProduct(request);

        assertThat(result.getId()).isEqualTo(2L);
        assertThat(result.getSku()).isEqualTo("SKU-2");
        assertThat(result.isLowStock()).isFalse();
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void createProductThrowsWhenSkuExists() {
        ProductRequestDto request = request("SKU-2", 10, 4);
        when(productRepository.existsBySku("SKU-2")).thenReturn(true);

        assertThatThrownBy(() -> productService.createProduct(request))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Product with SKU 'SKU-2' already exists");
    }

    @Test
    void updateProductThrowsWhenProductMissing() {
        when(productRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.updateProduct(42L, request("SKU-3", 10, 4)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Product not found with id: 42");
    }

    @Test
    void updateProductThrowsWhenSkuBelongsToAnotherProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product(1L, "OLD", 10, 4)));
        when(productRepository.existsBySkuAndIdNot("SKU-3", 1L)).thenReturn(true);

        assertThatThrownBy(() -> productService.updateProduct(1L, request("SKU-3", 10, 4)))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Product with SKU 'SKU-3' already exists");
    }

    @Test
    void updateProductSavesUpdatedValues() {
        Product existing = product(1L, "OLD", 10, 4);
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.existsBySkuAndIdNot("NEW", 1L)).thenReturn(false);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category()));
        when(productRepository.save(existing)).thenReturn(existing);

        ProductResponseDto result = productService.updateProduct(1L, request("NEW", 2, 5));

        assertThat(result.getSku()).isEqualTo("NEW");
        assertThat(result.getQuantity()).isEqualTo(2);
        assertThat(result.isLowStock()).isTrue();
    }

    @Test
    void deleteProductThrowsWhenMissing() {
        when(productRepository.existsById(20L)).thenReturn(false);

        assertThatThrownBy(() -> productService.deleteProduct(20L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Product not found with id: 20");
    }

    @Test
    void deleteProductDeletesWhenPresent() {
        when(productRepository.existsById(20L)).thenReturn(true);

        productService.deleteProduct(20L);

        verify(productRepository).deleteById(20L);
    }

    @Test
    void getLowStockProductsMapsRepositoryResult() {
        when(productRepository.findLowStockProducts()).thenReturn(List.of(product(1L, "LOW", 1, 5)));

        List<ProductResponseDto> result = productService.getLowStockProducts();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).isLowStock()).isTrue();
    }

    private ProductRequestDto request(String sku, int quantity, int minimumStock) {
        ProductRequestDto request = new ProductRequestDto();
        request.setSku(sku);
        request.setName("Laptop");
        request.setQuantity(quantity);
        request.setMinimumStock(minimumStock);
        request.setPrice(BigDecimal.valueOf(1200));
        request.setCategoryId(1L);
        return request;
    }

    private Product product(Long id, String sku, int quantity, int minimumStock) {
        return Product.builder()
                .id(id)
                .sku(sku)
                .name("Laptop")
                .quantity(quantity)
                .minimumStock(minimumStock)
                .price(BigDecimal.valueOf(1200))
                .category(category())
                .build();
    }

    private Category category() {
        return Category.builder()
                .id(1L)
                .name("Electronics")
                .build();
    }
}
