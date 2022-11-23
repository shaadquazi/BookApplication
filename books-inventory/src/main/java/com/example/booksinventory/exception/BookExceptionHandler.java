package com.example.booksinventory.exception;

import com.example.booksinventory.model.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class BookExceptionHandler {

    @ExceptionHandler(BookException.class)
    public final ResponseEntity<ErrorResponse> handleBookException(BookException ex, WebRequest request) {
        List<String> details = new ArrayList<>();
        return handleExceptionResponse(ex, details, ex.getStatus());
    }

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<ErrorResponse> handleException(Exception ex, WebRequest request) {
        List<String> details = new ArrayList<>();
        return handleExceptionResponse(ex, details, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<ErrorResponse> handleExceptionResponse(Exception ex, List<String> details, HttpStatus status){
        details.add(ex.getLocalizedMessage());
        ErrorResponse error = new ErrorResponse(status.value(), status.getReasonPhrase(), details);
        return new ResponseEntity<>(error, status);
    }

}
