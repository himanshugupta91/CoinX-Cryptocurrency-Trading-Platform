package com.himanshu.model;

import com.himanshu.domain.WithdrawalStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Entity representing a Withdrawal request.
 * Tracks the amount, status, date, and the user who requested it.
 */
@Entity
@Data
public class Withdrawal {
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private Long id;

    private WithdrawalStatus status;

    private Long amount;

    @ManyToOne
    private User user;

    private LocalDateTime date;
}
