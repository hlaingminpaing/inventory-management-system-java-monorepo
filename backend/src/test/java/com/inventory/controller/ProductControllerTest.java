package com.inventory.controller;

import com.inventory.dto.ProductRequestDto;
import com.inventory.dto.ProductResponseDto;
import com.inventory.service.ProductService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    @Mock
    private ProductService productService;

    @Test
    void getAllProductsReturnsServiceResult() {
        ProductResponseDto product = new ProductResponseDto();
        when(productService.getAllProducts()).thenReturn(List.of(product));

        var response = new ProductController(productService).getAllProducts();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsExactly(product);
    }

    @Test
    void getProductByIdReturnsServiceResult() {
        ProductResponseDto product = new ProductResponseDto();
        when(productService.getProductById(1L)).thenReturn(product);

        var response = new ProductController(productService).getProductById(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isSameAs(product);
    }

    @Test
    void createProductReturnsCreated() {
        ProductRequestDto request = new ProductRequestDto();
        ProductResponseDto product = new ProductResponseDto();
        when(productService.createProduct(request)).thenReturn(product);

        var response = new ProductController(productService).createProduct(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isSameAs(product);
    }

    @Test
    void updateProductReturnsUpdatedProduct() {
        ProductRequestDto request = new ProductRequestDto();
        ProductResponseDto product = new ProductResponseDto();
        when(productService.updateProduct(1L, request)).thenReturn(product);

        var response = new ProductController(productService).updateProduct(1L, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isSameAs(product);
    }

    @Test
    void deleteProductReturnsNoContent() {
        var response = new ProductController(productService).deleteProduct(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(productService).deleteProduct(1L);
    }
}
