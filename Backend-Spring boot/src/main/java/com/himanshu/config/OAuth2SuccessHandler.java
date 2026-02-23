package com.himanshu.config;

import com.himanshu.model.User;
import com.himanshu.repository.UserRepository;
import com.himanshu.service.WatchlistService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WatchlistService watchlistService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        DefaultOAuth2User oauth2User = (DefaultOAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String fullName = oauth2User.getAttribute("name");

        User user = userRepository.findByEmail(email);

        if (user == null) {
            user = new User();
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPassword(UUID.randomUUID().toString()); // Set a random password
            user.setVerified(true); // Google users are verified by default

            user = userRepository.save(user);

            // Create initial data for new user
            watchlistService.createWatchList(user);
            // Check if WalletService has a createWallet method, if so call it.
            // Based on AuthController logic, wallet might be created on demand or not
            // needed here yet.
        }

        // Create Authentication object for JWT generation
        List<SimpleGrantedAuthority> authorities = Collections
                .singletonList(new SimpleGrantedAuthority(user.getRole().toString()));
        Authentication newAuth = new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(newAuth);

        String token = JwtProvider.generateToken(newAuth);

        // Redirect to frontend
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/auth/google/success")
                .queryParam("token", token)
                .build().toUriString();

        response.sendRedirect(targetUrl);
    }
}
