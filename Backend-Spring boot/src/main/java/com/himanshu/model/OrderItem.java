package com.himanshu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing an individual item within an Order.
 * Links a Coin with its quantity and price details for a specific order.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private double quantity;

    @ManyToOne
    private Coin coin;

    private double buyPrice;

    private double sellPrice;

    @JsonIgnore
    @OneToOne
    private Order order;

}
