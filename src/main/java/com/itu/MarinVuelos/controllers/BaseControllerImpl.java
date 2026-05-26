package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.Base;
import com.itu.MarinVuelos.services.BaseServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public abstract class BaseControllerImpl<E extends Base, S extends BaseServiceImpl<E, Long>> implements BaseController<E, Long> {

    @Autowired
    protected S servicio;

    @GetMapping("")
    public ResponseEntity<?> getAll() throws Exception {
        return ResponseEntity.ok(servicio.findAll());
    }

    @GetMapping("/paged")
    public ResponseEntity<?> getAll(Pageable pageable) throws Exception {
        return ResponseEntity.ok(servicio.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(servicio.findById(id));
    }

    @PostMapping("")
    public ResponseEntity<?> save(@Valid @RequestBody E entity) throws Exception {
        return ResponseEntity.ok(servicio.save(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody E entity) throws Exception {
        return ResponseEntity.ok(servicio.update(id, entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) throws Exception {
        servicio.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
