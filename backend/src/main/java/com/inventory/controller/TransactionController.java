package com.inventory.controller;

import com.inventory.dto.TransactionRequestDto;
import com.inventory.dto.TransactionResponseDto;
import com.inventory.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Inventory transaction endpoints")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @Operation(summary = "Get all transactions (paginated)")
    public ResponseEntity<Page<TransactionResponseDto>> getAllTransactions(
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(transactionService.getAllTransactions(pageable));
    }

    @PostMapping
    @Operation(summary = "Record a new inventory transaction")
    public ResponseEntity<TransactionResponseDto> createTransaction(
            @Valid @RequestBody TransactionRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.createTransaction(request));
    }
}
