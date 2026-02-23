package com.himanshu.model;

import com.himanshu.domain.VerificationType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.Data;

/**
 * Entity representing a token for Forgot Password functionality.
 * Associates a unique token (ID) with a user and verification details.
 */
@Entity
@Data
public class ForgotPasswordToken {
    @Id
    private String id;

    @OneToOne
    private User user;

    private String otp;

    private VerificationType verificationType;

    private String sendTo;
}
