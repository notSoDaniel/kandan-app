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
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;

import java.util.List;
import java.util.UUID;

@Path("/column")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class KandanColumnResource {

    @Inject
    KandanColumnRepository kandanColumnRepository;

    @Inject
    BoardRepository boardRepository;

    @GET
    @Operation(summary = "Lista todas as colunas")
    @APIResponse(responseCode = "200", description = "Lista retornada com sucesso")
    public List<KandanColumnDTO> listAll() {
        return kandanColumnRepository.listAll()
                .stream()
                .map(k -> new KandanColumnDTO(k.id, k.board.id, k.name, k.position))
                .toList();
    }

    @POST
    @Transactional
    @Operation(summary = "Cria uma nova coluna")
    @APIResponse(responseCode = "201", description = "Coluna criada com sucesso")
    @APIResponse(responseCode = "400", description = "Dados inválidos")
    @APIResponse(responseCode = "404", description = "Board não encontrado")
    public Response create(@Valid KandanColumnCreateDTO dto) {
        KandanColumn column = new KandanColumn();
        Board board = boardRepository.findById(dto.boardId);
        if (board == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        column.board = board;
        column.name = dto.name;
        column.position = dto.position;
        kandanColumnRepository.persist(column);
        return Response.status(Response.Status.CREATED)
                .entity(new KandanColumnDTO(column.id, column.board.id, column.name, column.position))
                .build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @Operation(summary = "Atualiza uma coluna")
    @APIResponse(responseCode = "200", description = "Coluna atualizada com sucesso")
    @APIResponse(responseCode = "404", description = "Coluna ou board não encontrado")
    public Response update(@Parameter(description = "ID da coluna") @PathParam("id") UUID id,
                           @Valid KandanColumnCreateDTO dto) {
        KandanColumn column = kandanColumnRepository.findById(id);
        if (column == null) return Response.status(Response.Status.NOT_FOUND).build();

        Board board = boardRepository.findById(dto.boardId);
        if (board == null) return Response.status(Response.Status.NOT_FOUND).build();

        column.name = dto.name;
        column.position = dto.position;
        column.board = board;

        return Response.ok(new KandanColumnDTO(
                column.id,
                column.board.id,
                column.name,
                column.position
        )).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @Operation(summary = "Remove uma coluna")
    @APIResponse(responseCode = "204", description = "Coluna removida com sucesso")
    @APIResponse(responseCode = "404", description = "Coluna não encontrada")
    public Response delete(@Parameter(description = "ID da coluna") @PathParam("id") UUID id) {
        return kandanColumnRepository.findByIdOptional(id)
                .map(column -> {
                    kandanColumnRepository.delete(column);
                    return Response.noContent().build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @GET
    @Path("/board/{boardId}")
    @Operation(summary = "Lista colunas por board")
    @APIResponse(responseCode = "200", description = "Colunas retornadas com sucesso")
    public List<KandanColumnDTO> listByBoard(@Parameter(description = "ID do board") @PathParam("boardId") UUID boardId) {
        return kandanColumnRepository.list("board.id", boardId)
                .stream()
                .map(k -> new KandanColumnDTO(k.id, k.board.id, k.name, k.position))
                .toList();
    }
}