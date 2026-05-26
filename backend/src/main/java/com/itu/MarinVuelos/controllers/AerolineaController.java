package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.logistica.Aerolinea;
import com.itu.MarinVuelos.services.AerolineaServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/aerolineas")
public class AerolineaController extends BaseControllerImpl<Aerolinea, AerolineaServiceImpl> {
}
