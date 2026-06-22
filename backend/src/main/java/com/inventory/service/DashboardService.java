package com.inventory.service;

import com.inventory.dto.DashboardResponseDto;
import com.inventory.repository.CategoryRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final ProductService productService;
    private final TransactionService transactionService;

    public DashboardResponseDto getDashboardData() {
        DashboardResponseDto dto = new DashboardResponseDto();
        dto.setTotalProducts(productRepository.count());
        dto.setTotalCategories(categoryRepository.count());
        dto.setLowStockCount(productRepository.countLowStockProducts());
        dto.setTotalTransactions(transactionRepository.count());
        dto.setLowStockProducts(productService.getLowStockProducts());
        dto.setRecentTransactions(transactionService.getRecentTransactions());
        return dto;
    }
}
