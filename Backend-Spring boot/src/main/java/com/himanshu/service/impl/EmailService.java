package com.himanshu.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    /**
     * Sends a verification OTP email to the user.
     * 
     * @param userEmail The recipient's email address.
     * @param otp       The OTP to be sent.
     * @throws MessagingException If the message creation fails.
     * @throws MailSendException  If the mail sending fails.
     */
    @org.springframework.scheduling.annotation.Async
    public void sendVerificationOtpEmail(String userEmail, String otp) throws MessagingException, MailSendException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Account verification";
        String text = "your account verification code is : " + otp;

        helper.setSubject(subject);
        helper.setText(text, true);
        helper.setTo(userEmail);

        try {
            javaMailSender.send(mimeMessage);
        } catch (MailException e) {
            throw new MailSendException("Failed to send email");
        }
    }
}
