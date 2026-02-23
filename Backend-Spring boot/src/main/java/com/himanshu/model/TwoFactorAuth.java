package com.himanshu.model;

import com.himanshu.domain.VerificationType;
import lombok.Data;

/**
 * Embeddable class representing Two-Factor Authentication settings.
 * Stores whether 2FA is enabled and the verification type (e.g., MOBILE,
 * EMAIL).
 */
@Data
public class TwoFactorAuth {

    private boolean isEnabled = false;
    private VerificationType sendTo;
}
