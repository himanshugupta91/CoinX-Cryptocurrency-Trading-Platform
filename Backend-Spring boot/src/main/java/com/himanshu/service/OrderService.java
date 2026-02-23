package com.himanshu.service;

import com.himanshu.domain.OrderType;
import com.himanshu.model.Coin;
import com.himanshu.model.Order;
import com.himanshu.model.OrderItem;
import com.himanshu.model.User;

import java.util.List;

public interface OrderService {

    Order createOrder(User user, OrderItem orderItem, OrderType orderType);

    Order getOrderById(Long orderId);

    List<Order> getAllOrdersForUser(Long userId, String orderType, String assetSymbol);

    void cancelOrder(Long orderId);

    /**
     * Processes an order to buy or sell assets.
     * 
     * @param coin      The coin to trade.
     * @param quantity  The quantity.
     * @param orderType The type of order (BUY/SELL).
     * @param user      The user initiating the order.
     * @return The processed Order.
     * @throws Exception If invalid order type or insufficient funds/assets.
     */
    /**
     * Processes an order to buy or sell assets.
     * 
     * @param coin      The coin to trade.
     * @param quantity  The quantity.
     * @param orderType The type of order (BUY/SELL).
     * @param user      The user initiating the order.
     * @return The processed Order.
     * @throws Exception If invalid order type or insufficient funds/assets.
     */
    Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception;

}
