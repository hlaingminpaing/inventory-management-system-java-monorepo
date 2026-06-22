package com.inventory.repository;

import com.inventory.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    boolean existsBySku(String sku);
    boolean existsBySkuAndIdNot(String sku, Long id);
    List<Product> findByCategoryId(Long categoryId);

    @Query("SELECT p FROM Product p WHERE p.quantity <= p.minimumStock")
    List<Product> findLowStockProducts();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.quantity <= p.minimumStock")
    long countLowStockProducts();
}
