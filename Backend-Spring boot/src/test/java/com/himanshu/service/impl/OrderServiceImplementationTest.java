package com.himanshu.service.impl;

import com.himanshu.domain.OrderStatus;
import com.himanshu.domain.OrderType;
import com.himanshu.model.*;
import com.himanshu.repository.OrderItemRepository;
import com.himanshu.repository.OrderRepository;
import com.himanshu.service.AssetService;
import com.himanshu.service.WalletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplementationTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private AssetService assetService;

    @Mock
    private WalletService walletService;

    @Mock
    private OrderItemRepository orderItemRepository;

    @InjectMocks
    private OrderServiceImplementation orderService;

    private User user;
    private Order order;
    private OrderItem orderItem;
    private Coin coin;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        coin = new Coin();
        coin.setId("bitcoin");
        coin.setSymbol("BTC");
        coin.setCurrentPrice(50000.0);

        orderItem = new OrderItem();
        orderItem.setCoin(coin);
        orderItem.setQuantity(1.0);

        order = new Order();
        order.setId(1L);
        order.setUser(user);
        order.setOrderItem(orderItem);
        order.setOrderType(OrderType.BUY);
        order.setPrice(BigDecimal.valueOf(50000.0));
        order.setStatus(OrderStatus.PENDING);
    }

    @Test
    void testCreateOrder() {
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        Order createdOrder = orderService.createOrder(user, orderItem, OrderType.BUY);

        assertNotNull(createdOrder);
        assertEquals(OrderType.BUY, createdOrder.getOrderType());
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void testGetOrderById() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        Order foundOrder = orderService.getOrderById(1L);

        assertNotNull(foundOrder);
        assertEquals(1L, foundOrder.getId());
    }

    @Test
    void testGetAllOrdersForUser() {
        when(orderRepository.findByUserId(1L)).thenReturn(Arrays.asList(order));

        List<Order> orders = orderService.getAllOrdersForUser(1L, "BUY", "BTC");

        assertEquals(1, orders.size());
        assertEquals("BTC", orders.get(0).getOrderItem().getCoin().getSymbol());
    }

    @Test
    void testCancelOrder_Pending() {
        order.setStatus(OrderStatus.PENDING);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        orderService.cancelOrder(1L);

        assertEquals(OrderStatus.CANCELLED, order.getStatus());
        verify(orderRepository, times(1)).save(order);
    }

    @Test
    void testCancelOrder_NonPending() {
        order.setStatus(OrderStatus.SUCCESS);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThrows(IllegalStateException.class, () -> orderService.cancelOrder(1L));
    }

    @Test
    void testBuyAsset() throws Exception {
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(orderItem);
        // createOrder calls orderRepository.save
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(assetService.findAssetByUserIdAndCoinId(anyLong(), any())).thenReturn(null);

        Order resultOrder = orderService.buyAsset(coin, 1.0, user);

        assertNotNull(resultOrder);
        verify(walletService, times(1)).payOrderPayment(any(Order.class), any(User.class));
        verify(assetService, times(1)).createAsset(any(User.class), any(Coin.class), anyDouble());
    }

    @Test
    void testSellAsset() throws Exception {
        Asset asset = new Asset();
        asset.setId(1L);
        asset.setQuantity(2.0);
        asset.setBuyPrice(40000.0);

        when(assetService.findAssetByUserIdAndCoinId(anyLong(), any())).thenReturn(asset);
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(orderItem);
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(assetService.updateAsset(anyLong(), anyDouble())).thenReturn(asset);

        Order resultOrder = orderService.sellAsset(coin, 1.0, user);

        assertNotNull(resultOrder);
        verify(walletService, times(1)).payOrderPayment(any(Order.class), any(User.class));
        verify(assetService, times(1)).updateAsset(anyLong(), anyDouble());
    }
}
