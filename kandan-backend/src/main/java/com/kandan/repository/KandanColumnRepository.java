package com.kandan.repository;

import com.kandan.entity.KandanColumn;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.UUID;

@ApplicationScoped
public class KandanColumnRepository implements PanacheRepositoryBase<KandanColumn, UUID> {
}

