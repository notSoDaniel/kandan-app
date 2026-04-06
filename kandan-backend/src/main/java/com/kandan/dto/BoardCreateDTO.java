package com.kandan.dto;

import jakarta.validation.constraints.NotBlank;

public class BoardCreateDTO {

    @NotBlank(message = "Name is required")
    public String name;
}