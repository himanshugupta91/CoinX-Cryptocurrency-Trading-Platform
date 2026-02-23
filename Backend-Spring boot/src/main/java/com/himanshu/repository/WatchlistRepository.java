package com.himanshu.repository;

import com.himanshu.model.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    /**
     * Finds watchlist by user ID.
     * 
     * @param userId The user ID.
     * @return The watchlist.
     */
    Watchlist findByUserId(Long userId);

}
