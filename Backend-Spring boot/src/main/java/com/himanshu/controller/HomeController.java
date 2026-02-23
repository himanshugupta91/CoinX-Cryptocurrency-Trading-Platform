package com.himanshu.controller;

import com.himanshu.response.ApiResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for the home/root endpoint.
 * Serves as a health check or welcome message.
 */
@RestController
public class HomeController {

	@GetMapping("")
	public ResponseEntity<ApiResponse> homeController() {

		ApiResponse res = new ApiResponse(
				"welcome to crypto treading platform working fine",
				true);
		return new ResponseEntity<ApiResponse>(res, HttpStatus.ACCEPTED);
	}

}