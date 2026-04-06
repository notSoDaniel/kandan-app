package com.kandan.dto;

import com.kandan.entity.Board;

import java.util.UUID;

public class KandanColumnDTO {
    public UUID id;
    public UUID boardId;
    public String name;
    public Integer position;

    public KandanColumnDTO(UUID id, UUID boardId, String name, Integer position){
        this.id = id;
        this.boardId = boardId;
        this.name = name;
        this.position = position;
    }
}
