package com.himanshu.model;

import com.himanshu.domain.WalletTransactionType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

/**
 * Entity representing a transaction within a Wallet.
 * Records details like transaction type, amount, date, and purpose.
 */
@Entity
@Data
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private Wallet wallet;

    private WalletTransactionType type;

    private LocalDate date;

    private String transferId;

    private String purpose;

    private Long amount;

}
