package com.himanshu.repository;

import com.himanshu.model.Wallet;
import com.himanshu.model.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    /**
     * Finds transactions by wallet, ordered by date descending.
     * 
     * @param wallet The wallet.
     * @return List of transactions.
     */
    List<WalletTransaction> findByWalletOrderByDateDesc(Wallet wallet);

}
