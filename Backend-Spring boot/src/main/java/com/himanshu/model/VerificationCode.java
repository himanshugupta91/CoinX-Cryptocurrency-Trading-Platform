package com.himanshu.model;

import com.himanshu.domain.VerificationType;
import jakarta.persistence.*;
import lombok.Data;

/**
 * Entity for storing verification codes (OTP).
 * Associated with a user and a specific verification type (e.g., email or
 * mobile).
 */
@Entity
@Data
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String otp;

    @OneToOne
    private User user;

    private String email;

    private String mobile;

    private VerificationType verificationType;

}
