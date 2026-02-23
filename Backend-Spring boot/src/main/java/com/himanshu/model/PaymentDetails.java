package com.himanshu.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

/**
 * Entity for storing user Payment Details (Bank Account).
 * Links bank account information to a User.
 */
@Entity
@Data
public class PaymentDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String accountNumber;

    private String accountHolderName;

    private String ifsc;

    private String bankName;

    @OneToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private User user;

}
