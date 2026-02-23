package com.himanshu.service.impl;

import com.himanshu.domain.OrderType;
import com.himanshu.exception.WalletException;
import com.himanshu.model.*;
import com.himanshu.repository.WalletRepository;
import com.himanshu.repository.WalletTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalleteServiceImplementationTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private WalletTransactionRepository walletTransactionRepository;

    @InjectMocks
    private WalleteServiceImplementation walletService;

    private User user;
    private Wallet wallet;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        wallet = new Wallet();
        wallet.setId(1L);
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.ZERO);
    }

    @Test
    void testGenrateWallete() {
        when(walletRepository.save(any(Wallet.class))).thenAnswer(invocation -> {
            Wallet w = invocation.getArgument(0);
            w.setId(1L);
            return w;
        });

        Wallet createdWallet = walletService.genrateWallete(user);

        assertNotNull(createdWallet);
        assertEquals(user, createdWallet.getUser());
        assertEquals(BigDecimal.ZERO, createdWallet.getBalance());
        verify(walletRepository, times(1)).save(any(Wallet.class));
    }

    @Test
    void testGetUserWallet_Existing() throws WalletException {
        when(walletRepository.findByUserId(1L)).thenReturn(wallet);

        Wallet retrievedWallet = walletService.getUserWallet(user);

        assertNotNull(retrievedWallet);
        assertEquals(wallet.getId(), retrievedWallet.getId());
        verify(walletRepository, times(1)).findByUserId(1L);
    }

    @Test
    void testGetUserWallet_New() throws WalletException {
        when(walletRepository.findByUserId(1L)).thenReturn(null);
        when(walletRepository.save(any(Wallet.class))).thenAnswer(invocation -> {
            Wallet w = invocation.getArgument(0);
            w.setId(2L);
            return w;
        });

        Wallet retrievedWallet = walletService.getUserWallet(user);

        assertNotNull(retrievedWallet);
        assertEquals(2L, retrievedWallet.getId());
        verify(walletRepository, times(1)).findByUserId(1L);
        verify(walletRepository, times(1)).save(any(Wallet.class)); // Called in genrateWallete
    }

    @Test
    void testFindWalletById_Found() throws WalletException {
        when(walletRepository.findById(1L)).thenReturn(Optional.of(wallet));

        Wallet foundWallet = walletService.findWalletById(1L);

        assertNotNull(foundWallet);
        assertEquals(1L, foundWallet.getId());
    }

    @Test
    void testFindWalletById_NotFound() {
        when(walletRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(WalletException.class, () -> walletService.findWalletById(1L));
    }

    @Test
    void testWalletToWalletTransfer_Success() throws WalletException {
        User receiver = new User();
        receiver.setId(2L);
        Wallet receiverWallet = new Wallet();
        receiverWallet.setId(2L);
        receiverWallet.setUser(receiver);
        receiverWallet.setBalance(BigDecimal.ZERO);

        wallet.setBalance(BigDecimal.valueOf(100));

        when(walletRepository.findByUserId(1L)).thenReturn(wallet);

        // Note: The service method uses getUserWallet(sender) internally.
        // And it directly takes receiverWallet as argument.

        Wallet resultWallet = walletService.walletToWalletTransfer(user, receiverWallet, 50L);

        assertEquals(BigDecimal.valueOf(50), resultWallet.getBalance());
        assertEquals(BigDecimal.valueOf(50), receiverWallet.getBalance());

        verify(walletRepository, times(1)).save(wallet);
        verify(walletRepository, times(1)).save(receiverWallet);
    }

    @Test
    void testWalletToWalletTransfer_InsufficientBalance() throws WalletException {
        User receiver = new User();
        receiver.setId(2L);
        Wallet receiverWallet = new Wallet();
        receiverWallet.setId(2L);
        receiverWallet.setBalance(BigDecimal.ZERO);

        wallet.setBalance(BigDecimal.valueOf(10));
        when(walletRepository.findByUserId(1L)).thenReturn(wallet);

        assertThrows(WalletException.class, () -> walletService.walletToWalletTransfer(user, receiverWallet, 50L));
    }

    @Test
    void testAddBalanceToWallet() throws WalletException {
        wallet.setBalance(BigDecimal.valueOf(100));

        Wallet updatedWallet = walletService.addBalanceToWallet(wallet, 50L);

        assertEquals(BigDecimal.valueOf(150), updatedWallet.getBalance());
        verify(walletRepository, times(1)).save(wallet);
    }

    @Test
    void testPayOrderPayment_Buy_Success() throws WalletException {
        wallet.setBalance(BigDecimal.valueOf(100));
        when(walletRepository.findByUserId(1L)).thenReturn(wallet);

        Coin coin = new Coin();
        coin.setId("bitcoin");
        coin.setSymbol("BTC");

        OrderItem orderItem = new OrderItem();
        orderItem.setCoin(coin);

        Order order = new Order();
        order.setOrderType(OrderType.BUY);
        order.setPrice(BigDecimal.valueOf(50));
        order.setOrderItem(orderItem);

        Wallet updatedWallet = walletService.payOrderPayment(order, user);

        assertEquals(BigDecimal.valueOf(50), updatedWallet.getBalance());
        verify(walletTransactionRepository, times(1)).save(any(WalletTransaction.class));
        verify(walletRepository, times(1)).save(wallet);
    }

    @Test
    void testPayOrderPayment_Buy_InsufficientFunds() throws WalletException {
        wallet.setBalance(BigDecimal.valueOf(10));
        when(walletRepository.findByUserId(1L)).thenReturn(wallet);

        Coin coin = new Coin();
        coin.setId("bitcoin");
        coin.setSymbol("BTC");

        OrderItem orderItem = new OrderItem();
        orderItem.setCoin(coin);

        Order order = new Order();
        order.setOrderType(OrderType.BUY);
        order.setPrice(BigDecimal.valueOf(50));
        order.setOrderItem(orderItem);

        assertThrows(WalletException.class, () -> walletService.payOrderPayment(order, user));
    }

    @Test
    void testPayOrderPayment_Sell() throws WalletException {
        wallet.setBalance(BigDecimal.valueOf(50));
        when(walletRepository.findByUserId(1L)).thenReturn(wallet);

        Coin coin = new Coin();
        coin.setId("bitcoin");
        coin.setSymbol("BTC");

        OrderItem orderItem = new OrderItem();
        orderItem.setCoin(coin);

        Order order = new Order();
        order.setOrderType(OrderType.SELL);
        order.setPrice(BigDecimal.valueOf(50));
        order.setOrderItem(orderItem);

        Wallet updatedWallet = walletService.payOrderPayment(order, user);

        assertEquals(BigDecimal.valueOf(100), updatedWallet.getBalance());
        verify(walletTransactionRepository, times(1)).save(any(WalletTransaction.class));
        verify(walletRepository, times(1)).save(wallet);
    }
}
