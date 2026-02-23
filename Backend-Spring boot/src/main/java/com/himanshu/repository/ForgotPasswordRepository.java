package com.himanshu.repository;

import com.himanshu.model.ForgotPasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ForgotPasswordRepository extends JpaRepository<ForgotPasswordToken, String> {
    /**
     * Finds a token by user ID.
     * 
     * @param userId The user ID.
     * @return The token.
     */
    ForgotPasswordToken findByUserId(Long userId);
}
