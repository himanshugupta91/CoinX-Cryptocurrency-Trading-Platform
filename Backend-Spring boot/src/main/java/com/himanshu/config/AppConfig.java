package com.himanshu.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.Collections;

/**
 * Application security configuration.
 * Configures security filter chain, CORS, and password encoding.
 */
@Configuration
public class AppConfig {

	@Autowired
	private OAuth2SuccessHandler oAuth2SuccessHandler;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(Authorize -> Authorize
						// .requestMatchers("/api/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/**").authenticated()

						.anyRequest().permitAll())
				.oauth2Login(oauth -> {
					oauth.loginPage("/login/google");
					oauth.authorizationEndpoint(authorization -> authorization.baseUri("/login/oauth2/authorization"));
					oauth.successHandler(oAuth2SuccessHandler);
				})
				.addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
				.csrf(csrf -> csrf.disable())
				.cors(cors -> cors.configurationSource(corsConfigurationSource()));

		return http.build();

	}

	// CORS Configuration
	private CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration cfg = new CorsConfiguration();
		cfg.setAllowedOrigins(Arrays.asList(
				"http://localhost:3000",
				"http://localhost:5173",
				"http://localhost:5174",
				"http://localhost:4200",
				"https://zosh-treading.vercel.app"));
		cfg.setAllowedMethods(Collections.singletonList("*"));
		cfg.setAllowCredentials(true);
		cfg.setAllowedHeaders(Collections.singletonList("*"));
		cfg.setExposedHeaders(Arrays.asList("Authorization"));
		cfg.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", cfg);
		return source;
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
