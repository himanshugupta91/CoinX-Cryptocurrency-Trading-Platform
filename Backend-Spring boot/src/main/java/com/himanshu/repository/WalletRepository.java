package com.himanshu.repository;

import com.himanshu.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

    /**
     * Finds wallet by user ID.
     * 
     * @param userId The user ID.
     * @return The wallet.
     */
    public Wallet findByUserId(Long userId);

}
