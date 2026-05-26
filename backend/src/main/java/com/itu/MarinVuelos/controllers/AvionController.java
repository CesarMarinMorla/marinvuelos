package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.logistica.Avion;
import com.itu.MarinVuelos.services.AvionServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/aviones")
public class AvionController extends BaseControllerImpl<Avion, AvionServiceImpl> {
}
