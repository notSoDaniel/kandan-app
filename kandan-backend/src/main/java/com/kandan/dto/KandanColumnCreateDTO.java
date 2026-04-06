package com.kandan.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class KandanColumnCreateDTO {
    @NotNull(message = "boardID is required")
    public UUID boardId;
    @NotBlank(message = "Name is required")
    public String name;
    @NotNull(message = "position is required")
    public Integer position;
}
