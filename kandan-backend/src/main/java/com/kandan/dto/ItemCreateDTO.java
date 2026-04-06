package com.kandan.dto;

import com.kandan.entity.Item;
import com.kandan.entity.KandanColumn;
import jakarta.annotation.Nullable;

import java.util.UUID;

public class ItemCreateDTO {

    public UUID columnId;
    @Nullable
    public UUID parentId;
    public String title;
    public String description;
    public Integer position;
}
