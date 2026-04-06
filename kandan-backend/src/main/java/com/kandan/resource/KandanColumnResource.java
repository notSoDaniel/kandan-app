package com.kandan.resource;

import com.kandan.dto.KandanColumnCreateDTO;
import com.kandan.dto.KandanColumnDTO;
import com.kandan.entity.Board;
import com.kandan.entity.KandanColumn;
import com.kandan.repository.BoardRepository;
import com.kandan.repository.KandanColumnRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/column")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class KandanColumnResource {

    @Inject
    KandanColumnRepository kandanColumnRepository;

    @Inject
    BoardRepository boardRepository;

    @GET
    public List<KandanColumnDTO> listAll(){
        return kandanColumnRepository.listAll()
                .stream()
                .map(k -> new KandanColumnDTO(k.id, k.board.id, k.name, k.position))
                .toList();
    }

    @POST
    @Transactional
    public Response create(@Valid KandanColumnCreateDTO dto){
        KandanColumn column = new KandanColumn();
        Board boardId = boardRepository.findById(dto.boardId);
        if(boardId == null){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        column.board = boardId;
        column.name = dto.name;
        column.position = dto.position;
        kandanColumnRepository.persist(column);
        return Response.status(Response.Status.CREATED)
                .entity(new KandanColumnDTO(column.id, column.board.id,column.name, column.position))
                .build();
    }
}
