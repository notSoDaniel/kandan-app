package com.kandan.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class MoveItemDTO {
    @NotNull
    public UUID columnId;
    @NotNull
    public Integer position;
}