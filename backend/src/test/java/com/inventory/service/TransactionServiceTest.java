package com.inventory.service;

import com.inventory.dto.TransactionRequestDto;
import com.inventory.dto.TransactionResponseDto;
import com.inventory.entity.Category;
import com.inventory.entity.InventoryTransaction;
import com.inventory.entity.Product;
import com.inventory.exception.BadRequestException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static com.inventory.entity.InventoryTransaction.TransactionType.ADJUSTMENT;
import static com.inventory.entity.InventoryTransaction.TransactionType.IN;
import static com.inventory.entity.InventoryTransaction.TransactionType.OUT;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private TransactionService transactionService;

    @Test
    void getAllTransactionsMapsPage() {
        PageRequest pageable = PageRequest.of(0, 20);
        when(transactionRepository.findAllByOrderByCreatedAtDesc(pageable))
                .thenReturn(new PageImpl<>(List.of(transaction(1L, product(10), IN, 4))));

        Page<TransactionResponseDto> result = transactionService.getAllTransactions(pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getProductSku()).isEqualTo("SKU-1");
    }

    @Test
    void getRecentTransactionsMapsLatestItems() {
        when(transactionRepository.findTop10ByOrderByCreatedAtDesc())
                .thenReturn(List.of(transaction(1L, product(10), OUT, 2)));

        List<TransactionResponseDto> result = transactionService.getRecentTransactions();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTransactionType()).isEqualTo(OUT);
    }

    @Test
    void createTransactionAddsStockForInTransaction() {
        Product product = product(10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(transactionRepository.save(any(InventoryTransaction.class))).thenAnswer(invocation -> {
            InventoryTransaction transaction = invocation.getArgument(0);
            transaction.setId(50L);
            transaction.setCreatedAt(LocalDateTime.now());
            return transaction;
        });

        TransactionResponseDto result = transactionService.createTransaction(request(IN, 5));

        assertThat(product.getQuantity()).isEqualTo(15);
        assertThat(result.getId()).isEqualTo(50L);
        assertThat(result.getTransactionType()).isEqualTo(IN);
        verify(productRepository).save(product);
    }

    @Test
    void createTransactionSubtractsStockForOutTransaction() {
        Product product = product(10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(transactionRepository.save(any(InventoryTransaction.class))).thenAnswer(invocation -> {
            InventoryTransaction transaction = invocation.getArgument(0);
            transaction.setId(51L);
            transaction.setCreatedAt(LocalDateTime.now());
            return transaction;
        });

        transactionService.createTransaction(request(OUT, 4));

        assertThat(product.getQuantity()).isEqualTo(6);
    }

    @Test
    void createTransactionSetsStockForAdjustment() {
        Product product = product(10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(transactionRepository.save(any(InventoryTransaction.class))).thenAnswer(invocation -> {
            InventoryTransaction transaction = invocation.getArgument(0);
            transaction.setId(52L);
            transaction.setCreatedAt(LocalDateTime.now());
            return transaction;
        });

        transactionService.createTransaction(request(ADJUSTMENT, 7));

        assertThat(product.getQuantity()).isEqualTo(7);
    }

    @Test
    void createTransactionThrowsWhenProductMissing() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.createTransaction(request(IN, 1)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Product not found with id: 1");
    }

    @Test
    void createTransactionThrowsWhenStockIsInsufficient() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product(3)));

        assertThatThrownBy(() -> transactionService.createTransaction(request(OUT, 4)))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Insufficient stock. Available: 3, Requested: 4");
    }

    private TransactionRequestDto request(InventoryTransaction.TransactionType type, int quantity) {
        TransactionRequestDto request = new TransactionRequestDto();
        request.setProductId(1L);
        request.setTransactionType(type);
        request.setQuantity(quantity);
        request.setNotes("Cycle count");
        return request;
    }

    private InventoryTransaction transaction(Long id, Product product, InventoryTransaction.TransactionType type, int quantity) {
        return InventoryTransaction.builder()
                .id(id)
                .product(product)
                .transactionType(type)
                .quantity(quantity)
                .createdAt(LocalDateTime.now())
                .notes("Cycle count")
                .build();
    }

    private Product product(int quantity) {
        Category category = Category.builder().id(1L).name("Electronics").build();
        return Product.builder()
                .id(1L)
                .sku("SKU-1")
                .name("Laptop")
                .quantity(quantity)
                .minimumStock(5)
                .price(BigDecimal.valueOf(1200))
                .category(category)
                .build();
    }
}
