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

import java.util.List;

@Path("/items")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ItemResource {

    @Inject
    KandanColumnRepository kandanColumnRepository;

    @Inject
    ItemRepository itemRepository;

    @GET
    public List<ItemDTO> listAll(){
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
    public Response create(@Valid ItemCreateDTO dto){
        KandanColumn column = kandanColumnRepository.findById(dto.columnId);
        if(column == null){
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        Item item = new Item();
        if(dto.parentId != null){
            Item parent = itemRepository.findById(dto.parentId);
            if(parent == null){
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
}
