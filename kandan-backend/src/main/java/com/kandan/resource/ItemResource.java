package com.kandan.resource;

import com.kandan.dto.ItemCreateDTO;
import com.kandan.dto.ItemDTO;
import com.kandan.entity.Item;
import com.kandan.entity.KandanColumn;
import com.kandan.repository.ItemRepository;
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
import com.kandan.dto.MoveItemDTO;

import java.util.List;
import java.util.UUID;

@Path("/items")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ItemResource {

    @Inject
    KandanColumnRepository kandanColumnRepository;

    @Inject
    ItemRepository itemRepository;

    @GET
    @Operation(summary = "Lista todos os items")
    @APIResponse(responseCode = "200", description = "Lista retornada com sucesso")
    public List<ItemDTO> listAll() {
        return itemRepository.listAll()
                .stream()
                .map(i -> new ItemDTO(i.id,
                        i.column.id,
                        i.parent != null ? i.parent.id : null,
                        i.title,
                        i.description,
                        i.position,
                        i.createdAt))
                .toList();
    }

    @POST
    @Transactional
    @Operation(summary = "Cria um novo item")
    @APIResponse(responseCode = "201", description = "Item criado com sucesso")
    @APIResponse(responseCode = "400", description = "Dados inválidos")
    @APIResponse(responseCode = "404", description = "Coluna ou item pai não encontrado")
    public Response create(@Valid ItemCreateDTO dto) {
        KandanColumn column = kandanColumnRepository.findById(dto.columnId);
        if (column == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        Item item = new Item();
        if (dto.parentId != null) {
            Item parent = itemRepository.findById(dto.parentId);
            if (parent == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            item.parent = parent;
        }
        item.column = column;
        item.title = dto.title;
        item.description = dto.description;
        item.position = dto.position;
        itemRepository.persist(item);
        return Response.status(Response.Status.CREATED)
                .entity(new ItemDTO(item.id,
                        item.column.id,
                        item.parent != null ? item.parent.id : null,
                        item.title,
                        item.description,
                        item.position,
                        item.createdAt))
                .build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    @Operation(summary = "Atualiza um item")
    @APIResponse(responseCode = "200", description = "Item atualizado com sucesso")
    @APIResponse(responseCode = "404", description = "Item, coluna ou item pai não encontrado")
    public Response update(@Parameter(description = "ID do item") @PathParam("id") UUID id,
                           @Valid ItemCreateDTO dto) {
        Item item = itemRepository.findById(id);
        if (item == null) return Response.status(Response.Status.NOT_FOUND).build();

        KandanColumn column = kandanColumnRepository.findById(dto.columnId);
        if (column == null) return Response.status(Response.Status.NOT_FOUND).build();

        if (dto.parentId != null) {
            Item parent = itemRepository.findById(dto.parentId);
            if (parent == null) return Response.status(Response.Status.NOT_FOUND).build();
            item.parent = parent;
        } else {
            item.parent = null;
        }

        item.column = column;
        item.title = dto.title;
        item.description = dto.description;
        item.position = dto.position;

        return Response.ok(new ItemDTO(
                item.id,
                item.column.id,
                item.parent != null ? item.parent.id : null,
                item.title,
                item.description,
                item.position,
                item.createdAt
        )).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    @Operation(summary = "Remove um item")
    @APIResponse(responseCode = "204", description = "Item removido com sucesso")
    @APIResponse(responseCode = "404", description = "Item não encontrado")
    public Response delete(@Parameter(description = "ID do item") @PathParam("id") UUID id) {
        return itemRepository.findByIdOptional(id)
                .map(item -> {
                    itemRepository.delete(item);
                    return Response.noContent().build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @GET
    @Path("/column/{columnId}")
    @Operation(summary = "Lista itens por coluna")
    @APIResponse(responseCode = "200", description = "Itens retornados com sucesso")
    public List<ItemDTO> listByColumn(@Parameter(description = "ID da coluna") @PathParam("columnId") UUID columnId) {
        return itemRepository.list("column.id", columnId)
                .stream()
                .map(i -> new ItemDTO(
                        i.id,
                        i.column.id,
                        i.parent != null ? i.parent.id : null,
                        i.title,
                        i.description,
                        i.position,
                        i.createdAt))
                .toList();
    }

    @PATCH
    @Path("/{id}/move")
    @Transactional
    @Operation(summary = "Move um item para outra coluna")
    @APIResponse(responseCode = "200", description = "Item movido com sucesso")
    @APIResponse(responseCode = "404", description = "Item ou coluna não encontrado")
    public Response move(@Parameter(description = "ID do item") @PathParam("id") UUID id,
                         MoveItemDTO dto) {
        Item item = itemRepository.findById(id);
        if (item == null) return Response.status(Response.Status.NOT_FOUND).build();

        KandanColumn column = kandanColumnRepository.findById(dto.columnId);
        if (column == null) return Response.status(Response.Status.NOT_FOUND).build();

        item.column = column;
        item.position = dto.position;

        return Response.ok(new ItemDTO(
                item.id,
                item.column.id,
                item.parent != null ? item.parent.id : null,
                item.title,
                item.description,
                item.position,
                item.createdAt
        )).build();
    }
}