package com.himanshu.service.impl;

import com.himanshu.domain.VerificationType;
import com.himanshu.model.User;
import com.himanshu.model.VerificationCode;
import com.himanshu.repository.VerificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VerificationServiceImplTest {

    @Mock
    private VerificationRepository verificationRepository;

    @InjectMocks
    private VerificationServiceImpl verificationService;

    private User user;
    private VerificationCode verificationCode;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        verificationCode = new VerificationCode();
        verificationCode.setId(1L);
        verificationCode.setUser(user);
        verificationCode.setOtp("123456");
        verificationCode.setVerificationType(VerificationType.EMAIL);
    }

    @Test
    void testSendVerificationOTP() {
        when(verificationRepository.save(any(VerificationCode.class))).thenReturn(verificationCode);

        VerificationCode sentCode = verificationService.sendVerificationOTP(user, VerificationType.EMAIL);

        assertNotNull(sentCode);
        verify(verificationRepository, times(1)).save(any(VerificationCode.class));
    }

    @Test
    void testFindVerificationById_Found() throws Exception {
        when(verificationRepository.findById(1L)).thenReturn(Optional.of(verificationCode));

        VerificationCode foundCode = verificationService.findVerificationById(1L);

        assertNotNull(foundCode);
        assertEquals(1L, foundCode.getId());
    }

    @Test
    void testFindVerificationById_NotFound() {
        when(verificationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> verificationService.findVerificationById(1L));
    }

    @Test
    void testFindUsersVerification() throws Exception {
        when(verificationRepository.findByUserId(1L)).thenReturn(verificationCode);

        VerificationCode foundCode = verificationService.findUsersVerification(user);

        assertNotNull(foundCode);
        assertEquals(1L, foundCode.getId());
    }

    @Test
    void testVerifyOtp_Success() {
        Boolean isVerified = verificationService.VerifyOtp("123456", verificationCode);
        assertTrue(isVerified);
    }

    @Test
    void testVerifyOtp_Failure() {
        Boolean isVerified = verificationService.VerifyOtp("000000", verificationCode);
        assertFalse(isVerified);
    }

    @Test
    void testDeleteVerification() {
        doNothing().when(verificationRepository).delete(verificationCode);

        verificationService.deleteVerification(verificationCode);

        verify(verificationRepository, times(1)).delete(verificationCode);
    }
}
