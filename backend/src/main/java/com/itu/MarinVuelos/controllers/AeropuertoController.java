package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.logistica.Aeropuerto;
import com.itu.MarinVuelos.services.AeropuertoServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/aeropuertos")
public class AeropuertoController extends BaseControllerImpl<Aeropuerto, AeropuertoServiceImpl> {
}
