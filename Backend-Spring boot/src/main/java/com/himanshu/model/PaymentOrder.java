package com.himanshu.model;

import com.himanshu.domain.PaymentMethod;
import com.himanshu.domain.PaymentOrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a payment order.
 * Tracks amount, status, payment method, and the user who initiated it.
 */
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long amount;

    private PaymentOrderStatus status = PaymentOrderStatus.PENDING;

    private PaymentMethod paymentMethod;

    @ManyToOne
    private User user;
}
