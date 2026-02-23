package com.himanshu.repository;

import com.himanshu.model.PaymentDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentDetailsRepository extends JpaRepository<PaymentDetails, Long> {

    /**
     * Gets payment details by user ID.
     * 
     * @param userId The user ID.
     * @return The payment details.
     */
    PaymentDetails getPaymentDetailsByUserId(Long userId);
}
