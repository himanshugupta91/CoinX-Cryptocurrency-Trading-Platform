package com.himanshu.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a User's Watchlist.
 * Contains a list of Coins that the user is tracking.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Watchlist {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    private User user;

    @ManyToMany(fetch = FetchType.LAZY)
    private List<Coin> coins = new ArrayList<>();
}
