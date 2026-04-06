package com.kandan.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class BoardDTO {

    public UUID id;
    public String name;
    public LocalDateTime createdAt;

    public BoardDTO() {}

    public BoardDTO(UUID id, String name, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
    }
}