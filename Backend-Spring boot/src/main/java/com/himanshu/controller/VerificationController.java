package com.himanshu.controller;

import com.himanshu.service.impl.EmailService;
import com.himanshu.service.UserService;
import com.himanshu.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for verification related operations.
 * (Currently appears unused or work in progress as no endpoints are defined).
 */
@RestController
public class VerificationController {
    private final VerificationService verificationService;
    private final UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    public VerificationController(VerificationService verificationService, UserService userService) {
        this.verificationService = verificationService;
        this.userService = userService;
    }

}
