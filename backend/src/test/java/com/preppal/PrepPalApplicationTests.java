package com.preppal;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Verifies the Spring application context loads successfully.
 * MongoDB is excluded via test/resources/application.yml.
 */
@SpringBootTest
class PrepPalApplicationTests {

    @Test
    @DisplayName("Application context loads without errors")
    void contextLoads() {
        // If the context fails to start, this test will fail automatically.
    }
}
