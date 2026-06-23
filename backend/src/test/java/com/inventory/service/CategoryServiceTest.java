package com.inventory.service;

import com.inventory.dto.CategoryRequestDto;
import com.inventory.dto.CategoryResponseDto;
import com.inventory.entity.Category;
import com.inventory.entity.Product;
import com.inventory.exception.ConflictException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void getAllCategoriesMapsProductCount() {
        Category category = Category.builder()
                .id(1L)
                .name("Electronics")
                .description("Devices")
                .products(List.of(Product.builder().id(10L).build(), Product.builder().id(11L).build()))
                .build();
        when(categoryRepository.findAll()).thenReturn(List.of(category));

        List<CategoryResponseDto> result = categoryService.getAllCategories();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);
        assertThat(result.get(0).getName()).isEqualTo("Electronics");
        assertThat(result.get(0).getDescription()).isEqualTo("Devices");
        assertThat(result.get(0).getProductCount()).isEqualTo(2);
    }

    @Test
    void getCategoryByIdThrowsWhenMissing() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.getCategoryById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Category not found with id: 99");
    }

    @Test
    void createCategorySavesWhenNameIsUnique() {
        CategoryRequestDto request = new CategoryRequestDto();
        request.setName("Hardware");
        request.setDescription("Tools");
        when(categoryRepository.existsByNameIgnoreCase("Hardware")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category category = invocation.getArgument(0);
            category.setId(5L);
            return category;
        });

        CategoryResponseDto result = categoryService.createCategory(request);

        assertThat(result.getId()).isEqualTo(5L);
        assertThat(result.getName()).isEqualTo("Hardware");
        assertThat(result.getDescription()).isEqualTo("Tools");
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void createCategoryThrowsWhenNameExists() {
        CategoryRequestDto request = new CategoryRequestDto();
        request.setName("Hardware");
        when(categoryRepository.existsByNameIgnoreCase("Hardware")).thenReturn(true);

        assertThatThrownBy(() -> categoryService.createCategory(request))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Category with name 'Hardware' already exists");
    }
}
