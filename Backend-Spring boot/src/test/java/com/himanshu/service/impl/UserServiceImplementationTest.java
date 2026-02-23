package com.himanshu.service.impl;

import com.himanshu.config.JwtProvider;
import com.himanshu.domain.VerificationType;
import com.himanshu.exception.UserException;
import com.himanshu.model.TwoFactorAuth;
import com.himanshu.model.User;
import com.himanshu.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplementationTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImplementation userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setFullName("Test User");
        user.setPassword("encodedPassword");
    }

    @Test
    void testFindUserProfileByJwt() throws UserException {
        try (MockedStatic<JwtProvider> mockedJwtProvider = mockStatic(JwtProvider.class)) {
            mockedJwtProvider.when(() -> JwtProvider.getEmailFromJwtToken("validJwt")).thenReturn("test@example.com");
            when(userRepository.findByEmail("test@example.com")).thenReturn(user);

            User foundUser = userService.findUserProfileByJwt("validJwt");

            assertNotNull(foundUser);
            assertEquals("test@example.com", foundUser.getEmail());
        }
    }

    @Test
    void testFindUserProfileByJwt_NotFound() {
        try (MockedStatic<JwtProvider> mockedJwtProvider = mockStatic(JwtProvider.class)) {
            mockedJwtProvider.when(() -> JwtProvider.getEmailFromJwtToken("validJwt"))
                    .thenReturn("unknown@example.com");
            when(userRepository.findByEmail("unknown@example.com")).thenReturn(null);

            assertThrows(UserException.class, () -> userService.findUserProfileByJwt("validJwt"));
        }
    }

    @Test
    void testFindUserByEmail_Found() throws UserException {
        when(userRepository.findByEmail("test@example.com")).thenReturn(user);

        User foundUser = userService.findUserByEmail("test@example.com");

        assertNotNull(foundUser);
        assertEquals("test@example.com", foundUser.getEmail());
    }

    @Test
    void testFindUserByEmail_NotFound() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(null);

        assertThrows(UserException.class, () -> userService.findUserByEmail("unknown@example.com"));
    }

    @Test
    void testFindUserById_Found() throws UserException {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User foundUser = userService.findUserById(1L);

        assertNotNull(foundUser);
        assertEquals(1L, foundUser.getId());
    }

    @Test
    void testFindUserById_NotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserException.class, () -> userService.findUserById(1L));
    }

    @Test
    void testVerifyUser() throws UserException {
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User verifiedUser = userService.verifyUser(user);

        assertTrue(verifiedUser.isVerified());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testEnabledTwoFactorAuthentication() throws UserException {
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updatedUser = userService.enabledTwoFactorAuthentication(VerificationType.EMAIL, "test@example.com", user);

        assertNotNull(updatedUser.getTwoFactorAuth());
        assertTrue(updatedUser.getTwoFactorAuth().isEnabled());
        assertEquals(VerificationType.EMAIL, updatedUser.getTwoFactorAuth().getSendTo());
    }

    @Test
    void testUpdatePassword() {
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updatedUser = userService.updatePassword(user, "newPassword");

        assertEquals("newEncodedPassword", updatedUser.getPassword());
        verify(passwordEncoder, times(1)).encode("newPassword");
        verify(userRepository, times(1)).save(user);
    }
}
