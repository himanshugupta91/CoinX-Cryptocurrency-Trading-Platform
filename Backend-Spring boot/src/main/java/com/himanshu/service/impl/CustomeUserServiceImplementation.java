package com.himanshu.service.impl;

import com.himanshu.model.User;
import com.himanshu.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Custom implementation of UserDetailsService.
 * Used by Spring Security to load user specific data.
 * (Note: Class name has a typo 'Custome', should be 'Custom').
 */
@Service
public class CustomeUserServiceImplementation implements UserDetailsService {

	private UserRepository userRepository;

	public CustomeUserServiceImplementation(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		User user = userRepository.findByEmail(username);

		if (user == null) {

			throw new UsernameNotFoundException("user not found with email  - " + username);
		}

		List<GrantedAuthority> authorities = new ArrayList<>();

		return new org.springframework.security.core.userdetails.User(
				user.getEmail(), user.getPassword(), authorities);
	}

}
