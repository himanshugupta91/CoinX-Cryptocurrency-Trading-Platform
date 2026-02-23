package com.himanshu.service.impl;

import com.himanshu.domain.OrderType;
import com.himanshu.exception.WalletException;
import com.himanshu.model.*;

import com.himanshu.repository.WalletRepository;
import com.himanshu.repository.WalletTransactionRepository;
import com.himanshu.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

/**
 * Implementation of WalletService.
 * Manages user wallets, balance, and transfers.
 * (Note: Class name has a typo 'Wallete', should be 'Wallet').
 */
@Service
public class WalleteServiceImplementation implements WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    /**
     * Creates a new wallet for a user.
     *
     * @param user The user to create a wallet for.
     * @return The created wallet.
     */
    public Wallet genrateWallete(User user) {
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        return walletRepository.save(wallet);
    }

    /**
     * Retrieves the user's wallet. If it doesn't exist, one is created.
     *
     * @param user The user whose wallet is to be retrieved.
     * @return The user's wallet.
     * @throws WalletException If an error occurs.
     */
    @Override
    public Wallet getUserWallet(User user) throws WalletException {

        Wallet wallet = walletRepository.findByUserId(user.getId());
        if (wallet != null) {
            return wallet;
        }

        wallet = genrateWallete(user);
        return wallet;
    }

    /**
     * Finds a wallet by its ID.
     *
     * @param id The ID of the wallet.
     * @return The wallet.
     * @throws WalletException If the wallet is not found.
     */
    @Override
    public Wallet findWalletById(Long id) throws WalletException {
        Optional<Wallet> wallet = walletRepository.findById(id);
        if (wallet.isPresent()) {
            return wallet.get();
        }
        throw new WalletException("Wallet not found with id " + id);
    }

    /**
     * Transfers funds from one wallet to another.
     *
     * @param sender         The user sending the funds.
     * @param receiverWallet The wallet receiving the funds.
     * @param amount         The amount to transfer.
     * @return The sender's updated wallet.
     * @throws WalletException If the sender has insufficient balance.
     */
    @Override
    public Wallet walletToWalletTransfer(User sender, Wallet receiverWallet, Long amount) throws WalletException {
        Wallet senderWallet = getUserWallet(sender);

        if (senderWallet.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new WalletException("Insufficient balance...");
        }

        BigDecimal senderBalance = senderWallet.getBalance().subtract(BigDecimal.valueOf(amount));
        senderWallet.setBalance(senderBalance);
        walletRepository.save(senderWallet);

        BigDecimal receiverBalance = receiverWallet.getBalance();
        receiverBalance = receiverBalance.add(BigDecimal.valueOf(amount));
        receiverWallet.setBalance(receiverBalance);
        walletRepository.save(receiverWallet);

        return senderWallet;
    }

    /**
     * Processes payment for an order using the user's wallet.
     *
     * @param order The order to be paid for.
     * @param user  The user making the payment.
     * @return The updated wallet.
     * @throws WalletException If the user has insufficient funds for a BUY order.
     */
    @Override
    public Wallet payOrderPayment(Order order, User user) throws WalletException {
        Wallet wallet = getUserWallet(user);

        WalletTransaction walletTransaction = new WalletTransaction();
        walletTransaction.setWallet(wallet);
        walletTransaction.setPurpose(order.getOrderType() + " " + order.getOrderItem().getCoin().getId());

        walletTransaction.setDate(LocalDate.now());
        walletTransaction.setTransferId(order.getOrderItem().getCoin().getSymbol());

        if (order.getOrderType().equals(OrderType.BUY)) {
            // Deduct amount for buying
            walletTransaction.setAmount(-order.getPrice().longValue());
            BigDecimal newBalance = wallet.getBalance().subtract(order.getPrice());

            if (newBalance.compareTo(order.getPrice()) < 0) {
                System.out.println("inside");
                throw new WalletException("Insufficient funds for this transaction.");
            }
            System.out.println("outside---------- ");
            wallet.setBalance(newBalance);
        } else if (order.getOrderType().equals(OrderType.SELL)) {
            // Add amount for selling
            walletTransaction.setAmount(order.getPrice().longValue());
            BigDecimal newBalance = wallet.getBalance().add(order.getPrice());
            wallet.setBalance(newBalance);
        }

        walletTransactionRepository.save(walletTransaction);
        walletRepository.save(wallet);
        return wallet;
    }

    /**
     * Adds balance to a wallet.
     *
     * @param wallet The wallet to add balance to.
     * @param money  The amount to add.
     * @return The updated wallet.
     * @throws WalletException If an error occurs.
     */
    @Override
    public Wallet addBalanceToWallet(Wallet wallet, Long money) throws WalletException {

        BigDecimal newBalance = wallet.getBalance().add(BigDecimal.valueOf(money));

        wallet.setBalance(newBalance);

        walletRepository.save(wallet);
        System.out.println("updated wallet - " + wallet);
        return wallet;
    }

}
