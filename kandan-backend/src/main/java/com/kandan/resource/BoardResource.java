package com.kandan.resource;

import com.kandan.dto.BoardCreateDTO;
import com.kandan.dto.BoardDTO;
import com.kandan.entity.Board;
import com.kandan.repository.BoardRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.UUID;

@Path("/boards")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BoardResource {

    @Inject
    BoardRepository boardRepository;

    @GET
    public List<BoardDTO> listAll() {
        return boardRepository.listAll()
                .stream()
                .map(b -> new BoardDTO(b.id, b.name, b.createdAt))
                .toList();
    }

    @GET
    @Path("/{id}")
    public Response findById(@PathParam("id") UUID id) {
        return boardRepository.findByIdOptional(id)
                .map(b -> Response.ok(new BoardDTO(b.id, b.name, b.createdAt)).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @POST
    @Transactional
    public Response create(@Valid BoardCreateDTO dto) {
        Board board = new Board();
        board.name = dto.name;
        boardRepository.persist(board);
        return Response.status(Response.Status.CREATED)
                .entity(new BoardDTO(board.id, board.name, board.createdAt))
                .build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") UUID id, @Valid BoardCreateDTO dto) {
        return boardRepository.findByIdOptional(id)
                .map(board -> {
                    board.name = dto.name;
                    return Response.ok(new BoardDTO(board.id, board.name, board.createdAt)).build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") UUID id) {
        return boardRepository.findByIdOptional(id)
                .map(board -> {
                    boardRepository.delete(board);
                    return Response.noContent().build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }
}