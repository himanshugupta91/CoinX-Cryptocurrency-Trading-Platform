package com.himanshu.service.impl;

import com.himanshu.domain.WithdrawalStatus;
import com.himanshu.model.User;
import com.himanshu.model.Withdrawal;
import com.himanshu.repository.WithdrawalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WithdrawalServiceImplTest {

    @Mock
    private WithdrawalRepository withdrawalRepository;

    @InjectMocks
    private WithdrawalServiceImpl withdrawalService;

    private User user;
    private Withdrawal withdrawal;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        withdrawal = new Withdrawal();
        withdrawal.setId(1L);
        withdrawal.setAmount(100L);
        withdrawal.setStatus(WithdrawalStatus.PENDING);
        withdrawal.setUser(user);
        withdrawal.setDate(LocalDateTime.now());
    }

    @Test
    void testRequestWithdrawal() {
        when(withdrawalRepository.save(any(Withdrawal.class))).thenReturn(withdrawal);

        Withdrawal requestedWithdrawal = withdrawalService.requestWithdrawal(100L, user);

        assertNotNull(requestedWithdrawal);
        assertEquals(WithdrawalStatus.PENDING, requestedWithdrawal.getStatus());
        assertEquals(100L, requestedWithdrawal.getAmount());
        verify(withdrawalRepository, times(1)).save(any(Withdrawal.class));
    }

    @Test
    void testProcedWithdrawal_Success() throws Exception {
        when(withdrawalRepository.findById(1L)).thenReturn(Optional.of(withdrawal));
        when(withdrawalRepository.save(any(Withdrawal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Withdrawal processedWithdrawal = withdrawalService.procedWithdrawal(1L, true);

        assertEquals(WithdrawalStatus.SUCCESS, processedWithdrawal.getStatus());
        verify(withdrawalRepository, times(1)).findById(1L);
        verify(withdrawalRepository, times(1)).save(any(Withdrawal.class));
    }

    @Test
    void testProcedWithdrawal_Decline() throws Exception {
        when(withdrawalRepository.findById(1L)).thenReturn(Optional.of(withdrawal));
        when(withdrawalRepository.save(any(Withdrawal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Withdrawal processedWithdrawal = withdrawalService.procedWithdrawal(1L, false);

        assertEquals(WithdrawalStatus.DECLINE, processedWithdrawal.getStatus());
        verify(withdrawalRepository, times(1)).findById(1L);
        verify(withdrawalRepository, times(1)).save(any(Withdrawal.class));
    }

    @Test
    void testProcedWithdrawal_NotFound() {
        when(withdrawalRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> withdrawalService.procedWithdrawal(1L, true));
    }

    @Test
    void testGetUsersWithdrawalHistory() {
        when(withdrawalRepository.findByUserId(1L)).thenReturn(Arrays.asList(withdrawal));

        List<Withdrawal> history = withdrawalService.getUsersWithdrawalHistory(user);

        assertEquals(1, history.size());
        assertEquals(1L, history.get(0).getId());
    }

    @Test
    void testGetAllWithdrawalRequest() {
        when(withdrawalRepository.findAll()).thenReturn(Arrays.asList(withdrawal));

        List<Withdrawal> allWithdrawals = withdrawalService.getAllWithdrawalRequest();

        assertEquals(1, allWithdrawals.size());
    }
}
