package com.himanshu.controller;

import com.himanshu.config.JwtProvider;
import com.himanshu.exception.UserException;
import com.himanshu.model.TwoFactorOTP;
import com.himanshu.model.User;
import com.himanshu.repository.UserRepository;
import com.himanshu.request.LoginRequest;
import com.himanshu.request.SignupRequest;
import com.himanshu.response.AuthResponse;
import com.himanshu.service.*;
import com.himanshu.service.impl.CustomeUserServiceImplementation;
import com.himanshu.service.impl.EmailService;
import com.himanshu.utils.OtpUtils;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * Controller for handling User Authentication and Authorization.
 * Includes Signup, Signin, Two-Factor Authentication, and OAuth2.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private CustomeUserServiceImplementation customUserDetails;

	@Autowired
	private UserService userService;

	@Autowired
	private WatchlistService watchlistService;

	@Autowired
	private WalletService walletService;

	@Autowired
	private VerificationService verificationService;

	@Autowired
	private TwoFactorOtpService twoFactorOtpService;

	@Autowired
	private EmailService emailService;

	/**
	 * Registers a new user.
	 * 
	 * @param user The user object containing registration details.
	 * @return AuthResponse containing Jwt and success message.
	 * @throws UserException If email already exists.
	 */
	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthController.class);

	/**
	 * Registers a new user.
	 * 
	 * @param signupRequest The signup request containing registration details.
	 * @return AuthResponse containing Jwt and success message.
	 * @throws UserException If email already exists.
	 */
	@PostMapping("/signup")
	public ResponseEntity<AuthResponse> createUserHandler(
			@RequestBody SignupRequest signupRequest) throws UserException {

		String email = signupRequest.getEmail();
		String password = signupRequest.getPassword();
		String fullName = signupRequest.getFullName();
		String mobile = signupRequest.getMobile();

		User isEmailExist = userRepository.findByEmail(email);

		if (isEmailExist != null) {
			throw new UserException("Email Is Already Used With Another Account");
		}

		// Create new user
		User createdUser = new User();
		createdUser.setEmail(email);
		createdUser.setFullName(fullName);
		createdUser.setMobile(mobile);
		createdUser.setPassword(passwordEncoder.encode(password));

		User savedUser = userRepository.save(createdUser);

		watchlistService.createWatchList(savedUser);

		Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		String token = JwtProvider.generateToken(authentication);

		AuthResponse authResponse = new AuthResponse();
		authResponse.setJwt(token);
		authResponse.setMessage("Register Success");

		return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);

	}

	/**
	 * Signs in a user.
	 * 
	 * @param loginRequest The login request containing email and password.
	 * @return AuthResponse containing Jwt, session data for 2FA, or success
	 *         message.
	 * @throws UserException      If user not found.
	 * @throws MessagingException If email sending fails.
	 */
	@PostMapping("/signin")
	public ResponseEntity<AuthResponse> signing(@RequestBody LoginRequest loginRequest)
			throws UserException, MessagingException {

		String username = loginRequest.getEmail();
		String password = loginRequest.getPassword();

		logger.info("{} ----- {}", username, password);

		Authentication authentication = authenticate(username, password);

		User user = userService.findUserByEmail(username);

		SecurityContextHolder.getContext().setAuthentication(authentication);

		String token = JwtProvider.generateToken(authentication);

		if (user.getTwoFactorAuth().isEnabled()) {
			AuthResponse authResponse = new AuthResponse();
			authResponse.setMessage("Two factor authentication enabled");
			authResponse.setTwoFactorAuthEnabled(true);

			String otp = OtpUtils.generateOTP();

			TwoFactorOTP oldTwoFactorOTP = twoFactorOtpService.findByUser(user.getId());
			if (oldTwoFactorOTP != null) {
				twoFactorOtpService.deleteTwoFactorOtp(oldTwoFactorOTP);
			}

			TwoFactorOTP twoFactorOTP = twoFactorOtpService.createTwoFactorOtp(user, otp, token);

			emailService.sendVerificationOtpEmail(user.getEmail(), otp);

			authResponse.setSession(twoFactorOTP.getId());
			return new ResponseEntity<>(authResponse, HttpStatus.OK);
		}

		AuthResponse authResponse = new AuthResponse();

		authResponse.setMessage("Login Success");
		authResponse.setJwt(token);

		return new ResponseEntity<>(authResponse, HttpStatus.OK);
	}

	/**
	 * Authenticates a user with username and password.
	 * 
	 * @param username The username (email).
	 * @param password The password.
	 * @return Authentication object.
	 */
	private Authentication authenticate(String username, String password) {
		UserDetails userDetails = customUserDetails.loadUserByUsername(username);

		logger.info("sign in userDetails - {}", userDetails);

		if (userDetails == null) {
			logger.error("sign in userDetails - null {}", userDetails);
			throw new BadCredentialsException("Invalid username or password");
		}
		if (!passwordEncoder.matches(password, userDetails.getPassword())) {
			logger.error("sign in userDetails - password not match {}", userDetails);
			throw new BadCredentialsException("Invalid username or password");
		}
		return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
	}

	/**
	 * Redirects the user to Google's OAuth2 authorization page.
	 *
	 * @param request  The HTTP request.
	 * @param response The HTTP response.
	 * @throws IOException If redirection fails.
	 */
	@GetMapping("/login/google")
	public void redirectToGoogle(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		// Redirect to the Google OAuth2 authorization URI
		response.sendRedirect("/login/oauth2/authorization/google");
	}

	/**
	 * Handles the Google OAuth2 callback.
	 *
	 * @param code           The authorization code.
	 * @param state          The state parameter.
	 * @param authentication The OAuth2 authentication token.
	 * @return The user details extracted from Google.
	 */
	// /login/oauth2/code/google
	@GetMapping("/login/oauth2/code/google")
	public User handleGoogleCallback(@RequestParam(required = false, name = "code") String code,
			@RequestParam(required = false, name = "state") String state,
			OAuth2AuthenticationToken authentication) {

		// Extract user details from the authentication object or access token
		String email = authentication.getPrincipal().getAttribute("email");
		String fullName = authentication.getPrincipal().getAttribute("name");
		// You can extract more details as needed

		User user = new User();
		user.setEmail(email);
		user.setFullName(fullName);

		return user;
	}

	/**
	 * Verifies the Two-Factor Authentication OTP.
	 * 
	 * @param otp The One-Time Password to verify.
	 * @param id  The session ID associated with the 2FA request.
	 * @return AuthResponse containing JWT if verification is successful.
	 * @throws Exception If OTP is invalid.
	 */
	@PostMapping("/two-factor/otp/{otp}")
	public ResponseEntity<AuthResponse> verifySigningOtp(
			@PathVariable String otp,
			@RequestParam String id) throws Exception {

		TwoFactorOTP twoFactorOTP = twoFactorOtpService.findById(id);

		if (twoFactorOtpService.verifyTwoFactorOtp(twoFactorOTP, otp)) {
			AuthResponse authResponse = new AuthResponse();
			authResponse.setMessage("Two factor authentication verified");
			authResponse.setTwoFactorAuthEnabled(true);
			authResponse.setJwt(twoFactorOTP.getJwt());
			return new ResponseEntity<>(authResponse, HttpStatus.OK);
		}
		throw new Exception("invalid otp");
	}

}
