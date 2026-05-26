package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.actores.Piloto;
import com.itu.MarinVuelos.services.PilotoServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/pilotos")
public class PilotoController extends BaseControllerImpl<Piloto, PilotoServiceImpl> {
}
