package com.inventory.controller;

import com.inventory.dto.DashboardResponseDto;
import com.inventory.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardControllerTest {

    @Mock
    private DashboardService dashboardService;

    @Test
    void getDashboardReturnsServiceResult() {
        DashboardResponseDto dashboard = new DashboardResponseDto();
        when(dashboardService.getDashboardData()).thenReturn(dashboard);

        var response = new DashboardController(dashboardService).getDashboard();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isSameAs(dashboard);
    }
}
