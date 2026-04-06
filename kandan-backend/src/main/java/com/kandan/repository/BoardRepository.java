package com.kandan.repository;

import com.kandan.entity.Board;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.UUID;

@ApplicationScoped
public class BoardRepository implements PanacheRepositoryBase<Board, UUID> {
}