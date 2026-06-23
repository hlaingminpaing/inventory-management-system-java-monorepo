package com.inventory.service;

import com.inventory.dto.TransactionRequestDto;
import com.inventory.dto.TransactionResponseDto;
import com.inventory.entity.InventoryTransaction;
import com.inventory.entity.Product;
import com.inventory.exception.BadRequestException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<TransactionResponseDto> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toResponseDto);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponseDto> getRecentTransactions() {
        return transactionRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(this::toResponseDto)
                .toList();
    }

    public TransactionResponseDto createTransaction(TransactionRequestDto request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        // Adjust quantity based on transaction type
        int newQuantity = switch (request.getTransactionType()) {
            case IN -> product.getQuantity() + request.getQuantity();
            case OUT -> {
                if (product.getQuantity() < request.getQuantity()) {
                    throw new BadRequestException("Insufficient stock. Available: " + product.getQuantity()
                            + ", Requested: " + request.getQuantity());
                }
                yield product.getQuantity() - request.getQuantity();
            }
            case ADJUSTMENT -> request.getQuantity();
        };

        product.setQuantity(newQuantity);
        productRepository.save(product);

        InventoryTransaction transaction = InventoryTransaction.builder()
                .product(product)
                .transactionType(request.getTransactionType())
                .quantity(request.getQuantity())
                .notes(request.getNotes())
                .build();

        return toResponseDto(transactionRepository.save(transaction));
    }

    public TransactionResponseDto toResponseDto(InventoryTransaction transaction) {
        TransactionResponseDto dto = new TransactionResponseDto();
        dto.setId(transaction.getId());
        dto.setProductId(transaction.getProduct().getId());
        dto.setProductName(transaction.getProduct().getName());
        dto.setProductSku(transaction.getProduct().getSku());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setQuantity(transaction.getQuantity());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setNotes(transaction.getNotes());
        return dto;
    }
}
