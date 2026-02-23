package com.himanshu.service.impl;

import com.himanshu.model.PaymentDetails;
import com.himanshu.model.User;
import com.himanshu.repository.PaymentDetailsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentDetailsServiceImplTest {

    @Mock
    private PaymentDetailsRepository paymentDetailsRepository;

    @InjectMocks
    private PaymentDetailsServiceImpl paymentDetailsService;

    private User user;
    private PaymentDetails paymentDetails;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        paymentDetails = new PaymentDetails();
        paymentDetails.setId(1L);
        paymentDetails.setAccountNumber("1234567890");
        paymentDetails.setAccountHolderName("Test User");
        paymentDetails.setUser(user);
    }

    @Test
    void testAddPaymentDetails() {
        when(paymentDetailsRepository.save(any(PaymentDetails.class))).thenReturn(paymentDetails);

        PaymentDetails savedDetails = paymentDetailsService.addPaymentDetails(
                "1234567890", "Test User", "IFSC001", "Test Bank", user);

        assertNotNull(savedDetails);
        assertEquals("1234567890", savedDetails.getAccountNumber());
        verify(paymentDetailsRepository, times(1)).save(any(PaymentDetails.class));
    }

    @Test
    void testGetUsersPaymentDetails() {
        when(paymentDetailsRepository.getPaymentDetailsByUserId(1L)).thenReturn(paymentDetails);

        PaymentDetails retrievedDetails = paymentDetailsService.getUsersPaymentDetails(user);

        assertNotNull(retrievedDetails);
        assertEquals(1L, retrievedDetails.getUser().getId());
    }
}
