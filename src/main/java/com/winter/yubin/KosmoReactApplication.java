package com.winter.yubin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication(exclude = {SecurityException.class})
public class KosmoReactApplication {

    public static void main(String[] args) {
        SpringApplication.run(KosmoReactApplication.class, args);
    }

}
