package com.himanshu.controller;

import com.himanshu.domain.WalletTransactionType;
import com.himanshu.model.User;
import com.himanshu.model.Wallet;
import com.himanshu.model.WalletTransaction;
import com.himanshu.model.Withdrawal;
import com.himanshu.service.UserService;
import com.himanshu.service.WalletService;
import com.himanshu.service.WalletTransactionService;
import com.himanshu.service.WithdrawalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class WithdrawalController {

    @Autowired
    private WithdrawalService withdrawalService;

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserService userService;

    @Autowired
    private WalletTransactionService walletTransactionService;

    /**
     * Requests a withdrawal from the wallet.
     * 
     * @param amount The amount to withdraw.
     * @param jwt    The JWT token of the user.
     * @return The created Withdrawal request.
     * @throws Exception If insufficient funds or user issue.
     */
    @PostMapping("/api/withdrawal/{amount}")
    public ResponseEntity<?> withdrawalRequest(
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Wallet userWallet = walletService.getUserWallet(user);

        Withdrawal withdrawal = withdrawalService.requestWithdrawal(amount, user);
        walletService.addBalanceToWallet(userWallet, -withdrawal.getAmount());

        WalletTransaction walletTransaction = walletTransactionService.createTransaction(
                userWallet,
                WalletTransactionType.WITHDRAWAL, null,
                "bank account withdrawal",
                withdrawal.getAmount());

        return new ResponseEntity<>(withdrawal, HttpStatus.OK);
    }

    /**
     * Proceeds with a withdrawal request (Admin only).
     *
     * @param id     The ID of the withdrawal request.
     * @param accept True to accept, false to reject.
     * @param jwt    The JWT token (admin).
     * @return The updated Withdrawal object.
     * @throws Exception If an error occurs.
     */
    @PatchMapping("/api/admin/withdrawal/{id}/proceed/{accept}")
    public ResponseEntity<?> proceedWithdrawal(
            @PathVariable Long id,
            @PathVariable boolean accept,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        Withdrawal withdrawal = withdrawalService.procedWithdrawal(id, accept);

        Wallet userWallet = walletService.getUserWallet(user);
        if (!accept) {
            walletService.addBalanceToWallet(userWallet, withdrawal.getAmount());
        }

        return new ResponseEntity<>(withdrawal, HttpStatus.OK);
    }

    /**
     * Retrieves the withdrawal history for the authenticated user.
     *
     * @param jwt The JWT token of the user.
     * @return List of withdrawals.
     * @throws Exception If an error occurs.
     */
    @GetMapping("/api/withdrawal")
    public ResponseEntity<List<Withdrawal>> getWithdrawalHistory(

            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        List<Withdrawal> withdrawal = withdrawalService.getUsersWithdrawalHistory(user);

        return new ResponseEntity<>(withdrawal, HttpStatus.OK);
    }

    /**
     * Retrieves all withdrawal requests (Admin only).
     *
     * @param jwt The JWT token (admin).
     * @return List of all withdrawals.
     * @throws Exception If an error occurs.
     */
    @GetMapping("/api/admin/withdrawal")
    public ResponseEntity<List<Withdrawal>> getAllWithdrawalRequest(

            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        List<Withdrawal> withdrawal = withdrawalService.getAllWithdrawalRequest();

        return new ResponseEntity<>(withdrawal, HttpStatus.OK);
    }
}
