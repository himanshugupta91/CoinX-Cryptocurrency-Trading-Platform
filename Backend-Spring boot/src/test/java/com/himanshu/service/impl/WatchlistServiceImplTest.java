package com.himanshu.service.impl;

import com.himanshu.model.Coin;
import com.himanshu.model.User;
import com.himanshu.model.Watchlist;
import com.himanshu.repository.WatchlistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WatchlistServiceImplTest {

    @Mock
    private WatchlistRepository watchlistRepository;

    @InjectMocks
    private WatchlistServiceImpl watchlistService;

    private User user;
    private Watchlist watchlist;
    private Coin coin;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        coin = new Coin();
        coin.setId("bitcoin");
        coin.setSymbol("BTC");

        watchlist = new Watchlist();
        watchlist.setId(1L);
        watchlist.setUser(user);
        watchlist.setCoins(new ArrayList<>());
    }

    @Test
    void testFindUserWatchlist_Found() throws Exception {
        when(watchlistRepository.findByUserId(1L)).thenReturn(watchlist);

        Watchlist foundWatchlist = watchlistService.findUserWatchlist(1L);

        assertNotNull(foundWatchlist);
        assertEquals(1L, foundWatchlist.getId());
    }

    @Test
    void testFindUserWatchlist_NotFound() {
        when(watchlistRepository.findByUserId(1L)).thenReturn(null);

        assertThrows(Exception.class, () -> watchlistService.findUserWatchlist(1L));
    }

    @Test
    void testCreateWatchList() {
        when(watchlistRepository.save(any(Watchlist.class))).thenReturn(watchlist);

        Watchlist createdWatchlist = watchlistService.createWatchList(user);

        assertNotNull(createdWatchlist);
        verify(watchlistRepository, times(1)).save(any(Watchlist.class));
    }

    @Test
    void testFindById_Found() throws Exception {
        when(watchlistRepository.findById(1L)).thenReturn(Optional.of(watchlist));

        Watchlist foundWatchlist = watchlistService.findById(1L);

        assertNotNull(foundWatchlist);
        assertEquals(1L, foundWatchlist.getId());
    }

    @Test
    void testFindById_NotFound() {
        when(watchlistRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> watchlistService.findById(1L));
    }

    @Test
    void testAddItemToWatchlist_Add() throws Exception {
        when(watchlistRepository.findByUserId(1L)).thenReturn(watchlist);
        when(watchlistRepository.save(any(Watchlist.class))).thenReturn(watchlist);

        Coin addedCoin = watchlistService.addItemToWatchlist(coin, user);

        assertNotNull(addedCoin);
        assertTrue(watchlist.getCoins().contains(coin));
    }

    @Test
    void testAddItemToWatchlist_Remove() throws Exception {
        watchlist.getCoins().add(coin);
        when(watchlistRepository.findByUserId(1L)).thenReturn(watchlist);
        when(watchlistRepository.save(any(Watchlist.class))).thenReturn(watchlist);

        Coin removedCoin = watchlistService.addItemToWatchlist(coin, user);

        assertNotNull(removedCoin);
        assertFalse(watchlist.getCoins().contains(coin));
    }
}
