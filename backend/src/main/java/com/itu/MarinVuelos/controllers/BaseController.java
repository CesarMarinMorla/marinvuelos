package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.Base;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.Serializable;

public interface BaseController<E extends Base, ID extends Serializable> {
    ResponseEntity<?> getAll() throws Exception;
    ResponseEntity<?> getAll(Pageable pageable) throws Exception;
    ResponseEntity<?> getOne(@PathVariable ID id) throws Exception;
    ResponseEntity<?> save(@RequestBody E entity) throws Exception;
    ResponseEntity<?> update(@PathVariable ID id, @RequestBody E entity) throws Exception;
    ResponseEntity<?> delete(@PathVariable ID id) throws Exception;
}
