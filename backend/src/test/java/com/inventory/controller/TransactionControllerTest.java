package com.inventory.controller;

import com.inventory.dto.TransactionRequestDto;
import com.inventory.dto.TransactionResponseDto;
import com.inventory.service.TransactionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionControllerTest {

    @Mock
    private TransactionService transactionService;

    @Test
    void getAllTransactionsReturnsServicePage() {
        PageRequest pageable = PageRequest.of(0, 20);
        TransactionResponseDto transaction = new TransactionResponseDto();
        when(transactionService.getAllTransactions(pageable)).thenReturn(new PageImpl<>(List.of(transaction)));

        var response = new TransactionController(transactionService).getAllTransactions(pageable);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getContent()).containsExactly(transaction);
    }

    @Test
    void createTransactionReturnsCreated() {
        TransactionRequestDto request = new TransactionRequestDto();
        TransactionResponseDto transaction = new TransactionResponseDto();
        when(transactionService.createTransaction(request)).thenReturn(transaction);

        var response = new TransactionController(transactionService).createTransaction(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isSameAs(transaction);
    }
}
