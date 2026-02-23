package com.himanshu.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

/**
 * Entity representing the One-Time Password (OTP) used for Two-Factor
 * Authentication.
 * Links an OTP with a user and potentially a JWT.
 */
@Data
@Entity
public class TwoFactorOTP {
    @Id
    private String id;

    private String otp;

    @OneToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private User user;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String jwt;

}
