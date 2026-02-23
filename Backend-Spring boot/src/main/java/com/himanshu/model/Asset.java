package com.himanshu.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing an Asset owned by a user.
 * It links a specific Coin with the User who owns it, including quantity and
 * buy price.
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double quantity;
    private double buyPrice;

    @ManyToOne
    private Coin coin;

    @ManyToOne
    private User user;

}
