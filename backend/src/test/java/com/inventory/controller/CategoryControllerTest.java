package com.inventory.controller;

import com.inventory.dto.CategoryRequestDto;
import com.inventory.dto.CategoryResponseDto;
import com.inventory.service.CategoryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryControllerTest {

    @Mock
    private CategoryService categoryService;

    @Test
    void getAllCategoriesReturnsServiceResult() {
        CategoryResponseDto category = new CategoryResponseDto();
        category.setId(1L);
        when(categoryService.getAllCategories()).thenReturn(List.of(category));

        var response = new CategoryController(categoryService).getAllCategories();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsExactly(category);
    }

    @Test
    void getCategoryByIdReturnsServiceResult() {
        CategoryResponseDto category = new CategoryResponseDto();
        category.setId(1L);
        when(categoryService.getCategoryById(1L)).thenReturn(category);

        var response = new CategoryController(categoryService).getCategoryById(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isSameAs(category);
    }

    @Test
    void createCategoryReturnsCreated() {
        CategoryRequestDto request = new CategoryRequestDto();
        CategoryResponseDto category = new CategoryResponseDto();
        when(categoryService.createCategory(request)).thenReturn(category);

        var response = new CategoryController(categoryService).createCategory(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isSameAs(category);
    }
}
