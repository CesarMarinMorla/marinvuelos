package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.Reserva;
import com.itu.MarinVuelos.services.ReservaServiceImpl;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reservas")
public class ReservaController extends BaseControllerImpl<Reserva, ReservaServiceImpl> {
}
