package com.example.demo.student;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class StudentNotFound extends RuntimeException {
    public StudentNotFound(String msg) {
        super(msg);
    }
}