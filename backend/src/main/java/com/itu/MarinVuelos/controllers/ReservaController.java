package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.Reserva;
import com.itu.MarinVuelos.repositories.ReservaRepository;
import com.itu.MarinVuelos.services.ReservaServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/reservas")
public class ReservaController extends BaseControllerImpl<Reserva, ReservaServiceImpl> {

    @Autowired
    private ReservaRepository reservaRepository;

    @GetMapping("")
    @Override
    public ResponseEntity<?> getAll() throws Exception {
        return ResponseEntity.ok(servicio.findAll());
    }

    @GetMapping(params = "usuarioId")
    public ResponseEntity<?> getByUsuario(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(reservaRepository.findByUsuarioId(usuarioId));
    }
}
