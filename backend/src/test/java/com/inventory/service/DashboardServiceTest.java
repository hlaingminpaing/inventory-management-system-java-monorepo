package com.inventory.service;

import com.inventory.dto.ProductResponseDto;
import com.inventory.dto.TransactionResponseDto;
import com.inventory.entity.InventoryTransaction;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private ProductService productService;

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private DashboardService dashboardService;

    @Test
    void getDashboardDataAggregatesRepositoryAndServiceData() {
        ProductResponseDto lowStockProduct = new ProductResponseDto();
        lowStockProduct.setId(1L);
        TransactionResponseDto recentTransaction = new TransactionResponseDto();
        recentTransaction.setTransactionType(InventoryTransaction.TransactionType.IN);
        when(productRepository.count()).thenReturn(12L);
        when(categoryRepository.count()).thenReturn(3L);
        when(productRepository.countLowStockProducts()).thenReturn(2L);
        when(transactionRepository.count()).thenReturn(8L);
        when(productService.getLowStockProducts()).thenReturn(List.of(lowStockProduct));
        when(transactionService.getRecentTransactions()).thenReturn(List.of(recentTransaction));

        var result = dashboardService.getDashboardData();

        assertThat(result.getTotalProducts()).isEqualTo(12);
        assertThat(result.getTotalCategories()).isEqualTo(3);
        assertThat(result.getLowStockCount()).isEqualTo(2);
        assertThat(result.getTotalTransactions()).isEqualTo(8);
        assertThat(result.getLowStockProducts()).containsExactly(lowStockProduct);
        assertThat(result.getRecentTransactions()).containsExactly(recentTransaction);
    }
}
