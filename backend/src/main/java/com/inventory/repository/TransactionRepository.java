package com.inventory.repository;

import com.inventory.entity.InventoryTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findByProductId(Long productId);
    Page<InventoryTransaction> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<InventoryTransaction> findTop10ByOrderByCreatedAtDesc();
}
