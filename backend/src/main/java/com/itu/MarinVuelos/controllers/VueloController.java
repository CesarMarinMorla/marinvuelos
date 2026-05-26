package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.logistica.Vuelo;
import com.itu.MarinVuelos.services.VueloServiceImpl;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/vuelos")
public class VueloController extends BaseControllerImpl<Vuelo, VueloServiceImpl> {
}
