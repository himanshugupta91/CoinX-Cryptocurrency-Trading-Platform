package com.himanshu.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity representing a notification sent to a user.
 * Stores details about the sender, receiver, amount (if applicable), and
 * message.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    private Long fromUserId;
    private Long toUserid;
    private Long amount;
    private String message;
}
