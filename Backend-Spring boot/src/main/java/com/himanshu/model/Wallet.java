package com.himanshu.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Entity representing a User's Wallet.
 * Holds the current balance and is linked to a unique user.
 */
@Entity
@Table(name = "wallets")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    private BigDecimal balance = BigDecimal.ZERO;
}
