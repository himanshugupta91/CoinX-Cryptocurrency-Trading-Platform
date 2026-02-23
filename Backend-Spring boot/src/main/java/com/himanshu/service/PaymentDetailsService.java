package com.himanshu.service;

import com.himanshu.model.PaymentDetails;
import com.himanshu.model.User;

public interface PaymentDetailsService {
    /**
     * Adds payment details for a user.
     * 
     * @param accountNumber     Bank account number.
     * @param accountHolderName Account holder name.
     * @param ifsc              IFSC code.
     * @param bankName          Bank name.
     * @param user              The user.
     * @return The saved PaymentDetails.
     */
    public PaymentDetails addPaymentDetails(String accountNumber,
            String accountHolderName,
            String ifsc,
            String bankName,
            User user);

    public PaymentDetails getUsersPaymentDetails(User user);

}
