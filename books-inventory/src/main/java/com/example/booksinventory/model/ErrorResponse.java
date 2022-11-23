package com.example.booksinventory.model;

import java.util.List;

public class ErrorResponse
{
    public ErrorResponse(Integer code, String message, List<String> details) {
        this.code = code;
        this.message = message;
        this.details = details;
    }

    private Integer code;
    private String message;
    private List<String> details;

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getDetails() {
        return details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }

}
