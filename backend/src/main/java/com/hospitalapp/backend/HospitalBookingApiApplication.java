package com.hospitalapp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class HospitalBookingApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(HospitalBookingApiApplication.class, args);
	}

}
