package com.himanshu.service.impl;

import com.himanshu.domain.WalletTransactionType;
import com.himanshu.model.Wallet;
import com.himanshu.model.WalletTransaction;
import com.himanshu.repository.WalletTransactionRepository;
import com.himanshu.service.WalletTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Implementation of WalletTransactionService.
 * Manages transaction history for wallets.
 */
@Service
public class WalletTransactionServiceImpl implements WalletTransactionService {

    private final WalletTransactionRepository walletTransactionRepository;

    @Autowired
    public WalletTransactionServiceImpl(WalletTransactionRepository walletTransactionRepository) {
        this.walletTransactionRepository = walletTransactionRepository;
    }

    @Override
    public WalletTransaction createTransaction(Wallet wallet,
            WalletTransactionType type,
            String transferId,
            String purpose,
            Long amount) {
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setDate(LocalDate.now());
        transaction.setType(type);
        transaction.setTransferId(transferId);
        transaction.setPurpose(purpose);
        transaction.setAmount(amount);

        return walletTransactionRepository.save(transaction);
    }

    @Override
    public List<WalletTransaction> getTransactions(Wallet wallet, WalletTransactionType type) {
        return walletTransactionRepository.findByWalletOrderByDateDesc(wallet);
    }
}
