package com.himanshu.controller;

import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import com.himanshu.domain.PaymentMethod;
import com.himanshu.exception.UserException;
import com.himanshu.model.PaymentOrder;
import com.himanshu.model.User;
import com.himanshu.response.PaymentResponse;
import com.himanshu.service.PaymentService;
import com.himanshu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController {

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    /**
     * Handles payment creation.
     * 
     * @param paymentMethod The payment method (RAZORPAY or STRIPE).
     * @param amount        The amount to pay.
     * @param jwt           The JWT token of the user.
     * @return PaymentResponse containing the payment link.
     * @throws UserException     If user not found.
     * @throws RazorpayException If Razorpay error occurs.
     * @throws StripeException   If Stripe error occurs.
     */
    @PostMapping("/api/payment/{paymentMethod}/amount/{amount}")
    public ResponseEntity<PaymentResponse> paymentHandler(
            @PathVariable PaymentMethod paymentMethod,
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt) throws UserException, RazorpayException, StripeException {

        User user = userService.findUserProfileByJwt(jwt);

        PaymentResponse paymentResponse;

        PaymentOrder order = paymentService.createOrder(user, amount, paymentMethod);

        if (paymentMethod.equals(PaymentMethod.RAZORPAY)) {
            paymentResponse = paymentService.createRazorpayPaymentLink(user, amount,
                    order.getId());
        } else {
            paymentResponse = paymentService.createStripePaymentLink(user, amount, order.getId());
        }

        return new ResponseEntity<>(paymentResponse, HttpStatus.CREATED);
    }

}
