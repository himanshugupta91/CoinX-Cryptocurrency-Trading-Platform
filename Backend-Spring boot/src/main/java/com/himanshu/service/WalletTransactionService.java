package com.himanshu.service;

import com.himanshu.domain.WalletTransactionType;
import com.himanshu.model.Wallet;
import com.himanshu.model.WalletTransaction;

import java.util.List;

public interface WalletTransactionService {
    /**
     * Creates a new wallet transaction.
     * 
     * @param wallet     The wallet involved.
     * @param type       The type of transaction.
     * @param transferId Transfer ID (e.g., coin symbol).
     * @param purpose    Description or purpose.
     * @param amount     The transaction amount.
     * @return The created WalletTransaction.
     */
    WalletTransaction createTransaction(Wallet wallet,
            WalletTransactionType type,
            String transferId,
            String purpose,
            Long amount);

    List<WalletTransaction> getTransactions(Wallet wallet, WalletTransactionType type);

}
