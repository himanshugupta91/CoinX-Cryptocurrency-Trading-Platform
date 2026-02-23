package com.himanshu.controller;

import com.himanshu.model.Coin;
import com.himanshu.model.Order;
import com.himanshu.model.User;
import com.himanshu.request.CreateOrderRequest;
import com.himanshu.service.CoinService;
import com.himanshu.service.OrderService;
import com.himanshu.service.UserService;

import com.himanshu.service.WalletTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private OrderService orderService;

    private UserService userSerivce;

    @Autowired
    private CoinService coinService;

    @Autowired
    private WalletTransactionService walletTransactionService;

    // private

    @Autowired
    public OrderController(OrderService orderService, UserService userSerivce) {
        this.orderService = orderService;
        this.userSerivce = userSerivce;
    }

    /**
     * Creates a new order payment (though method is named payOrderPayment, it
     * creates an order).
     * 
     * @param jwt The JWT token of the user.
     * @param req The request object for creating an order.
     * @return The created Order.
     * @throws Exception If coin or user not found.
     */
    @PostMapping("/pay")
    public ResponseEntity<Order> payOrderPayment(
            @RequestHeader("Authorization") String jwt,
            @RequestBody CreateOrderRequest req

    ) throws Exception {
        User user = userSerivce.findUserProfileByJwt(jwt);
        Coin coin = coinService.findById(req.getCoinId());

        Order order = orderService.processOrder(coin, req.getQuantity(), req.getOrderType(), user);

        return ResponseEntity.ok(order);

    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @RequestHeader("Authorization") String jwtToken,
            @PathVariable Long orderId) throws Exception {
        if (jwtToken == null) {
            throw new Exception("token missing...");
        }

        User user = userSerivce.findUserProfileByJwt(jwtToken);

        Order order = orderService.getOrderById(orderId);
        if (order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping()
    public ResponseEntity<List<Order>> getAllOrdersForUser(
            @RequestHeader("Authorization") String jwtToken,
            @RequestParam(required = false) String order_type,
            @RequestParam(required = false) String asset_symbol) throws Exception {
        if (jwtToken == null) {
            throw new Exception("token missing...");
        }

        Long userId = userSerivce.findUserProfileByJwt(jwtToken).getId();

        List<Order> userOrders = orderService.getAllOrdersForUser(userId, order_type, asset_symbol);
        return ResponseEntity.ok(userOrders);
    }

}
