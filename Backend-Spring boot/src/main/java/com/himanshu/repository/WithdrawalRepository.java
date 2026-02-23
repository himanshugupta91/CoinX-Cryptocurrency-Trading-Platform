package com.himanshu.repository;

import com.himanshu.model.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
    /**
     * Finds withdrawals by user ID.
     * 
     * @param userId The user ID.
     * @return List of withdrawals.
     */
    List<Withdrawal> findByUserId(Long userId);
}
