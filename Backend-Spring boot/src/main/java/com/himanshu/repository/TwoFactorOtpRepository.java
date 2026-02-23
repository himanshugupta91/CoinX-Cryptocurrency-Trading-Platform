package com.himanshu.repository;

import com.himanshu.model.TwoFactorOTP;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TwoFactorOtpRepository extends JpaRepository<TwoFactorOTP, String> {

    /**
     * Finds OTP by user ID.
     * 
     * @param userId The user ID.
     * @return The OTP.
     */
    TwoFactorOTP findByUserId(Long userId);
}
