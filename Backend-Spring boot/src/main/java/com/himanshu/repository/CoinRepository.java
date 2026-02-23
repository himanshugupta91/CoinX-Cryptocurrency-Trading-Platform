package com.himanshu.repository;

import com.himanshu.model.Coin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoinRepository extends JpaRepository<Coin,String> {
}
