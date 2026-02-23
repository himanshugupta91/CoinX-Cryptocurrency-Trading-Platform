package com.himanshu.repository;

import com.himanshu.model.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationRepository extends JpaRepository<VerificationCode, Long> {
    /**
     * Finds verification code by user ID.
     * 
     * @param userId The user ID.
     * @return The verification code.
     */
    VerificationCode findByUserId(Long userId);
}
