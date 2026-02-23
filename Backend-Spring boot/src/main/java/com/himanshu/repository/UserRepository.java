package com.himanshu.repository;

import com.himanshu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

	/**
	 * Finds a user by email.
	 * 
	 * @param email The email address.
	 * @return The user.
	 */
	public User findByEmail(String email);

}
