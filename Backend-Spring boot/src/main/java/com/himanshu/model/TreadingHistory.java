package com.himanshu.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing trading history.
 * Records the buying and selling prices, the coin involved, and the user.
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TreadingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private double sellingPrice;

    private double buyingPrice;

    @Embedded
    private Coin coin;

    @ManyToOne
    private User user;
}
