package com.kandan.dto;

import com.kandan.entity.Item;
import com.kandan.entity.KandanColumn;

import java.time.LocalDateTime;
import java.util.UUID;

public class ItemDTO {
    public UUID id;
    public UUID columnId;
    public UUID parentId;
    public String title;
    public String description;
    public Integer position;
    public LocalDateTime createdAt = LocalDateTime.now();

    public ItemDTO(){}

    public ItemDTO(UUID id, UUID columnId, UUID parentId, String title,
                   String description, Integer position, LocalDateTime createdAt){
        this.id = id;
        this.columnId = columnId;
        this.parentId = parentId;
        this.title = title;
        this.description = description;
        this.position = position;
        this.createdAt = createdAt;
    }
}
