package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.logistica.Vuelo;
import com.itu.MarinVuelos.services.VueloServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/vuelos")
public class VueloController extends BaseControllerImpl<Vuelo, VueloServiceImpl> {

    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaSalida,
            @RequestParam(required = false) Long aerolineaId,
            @RequestParam(required = false) Long aeropuertoOrigenId,
            @RequestParam(required = false) Long aeropuertoDestinoId,
            Pageable pageable) throws Exception {
        Page<Vuelo> page = servicio.buscar(fechaSalida, aerolineaId, aeropuertoOrigenId, aeropuertoDestinoId, pageable);
        return ResponseEntity.ok(page);
    }
}
