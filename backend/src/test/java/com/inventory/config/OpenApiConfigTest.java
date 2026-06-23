package com.inventory.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class OpenApiConfigTest {

    @Test
    void inventoryOpenAPIContainsExpectedMetadata() {
        var openAPI = new OpenApiConfig().inventoryOpenAPI();

        assertThat(openAPI.getInfo().getTitle()).isEqualTo("Inventory Management API");
        assertThat(openAPI.getInfo().getVersion()).isEqualTo("1.0.0");
        assertThat(openAPI.getInfo().getContact().getEmail()).isEqualTo("team@inventory.com");
        assertThat(openAPI.getInfo().getLicense().getName()).isEqualTo("Apache 2.0");
    }
}
