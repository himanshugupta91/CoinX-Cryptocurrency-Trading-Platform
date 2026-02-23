package com.himanshu.service;

import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import com.himanshu.domain.PaymentMethod;
import com.himanshu.model.PaymentOrder;
import com.himanshu.model.User;
import com.himanshu.response.PaymentResponse;

public interface PaymentService {

    PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    Boolean ProccedPaymentOrder(PaymentOrder paymentOrder,
            String paymentId) throws RazorpayException;

    /**
     * Creates a Razorpay payment link.
     * 
     * @param user    The user.
     * @param Amount  The amount.
     * @param orderId The order ID.
     * @return The payment response containing the link.
     * @throws RazorpayException If error occurs.
     */
    PaymentResponse createRazorpayPaymentLink(User user,
            Long Amount,
            Long orderId) throws RazorpayException;

    /**
     * Creates a Stripe payment link.
     * 
     * @param user    The user.
     * @param Amount  The amount.
     * @param orderId The order ID.
     * @return The payment response containing the link.
     * @throws StripeException If error occurs.
     */
    PaymentResponse createStripePaymentLink(User user, Long Amount,
            Long orderId) throws StripeException;
}
