package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.logistica.Ciudad;
import com.itu.MarinVuelos.services.CiudadServiceImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping(path = "api/v1/ciudades")
public class CiudadController extends BaseControllerImpl<Ciudad, CiudadServiceImpl> {
}
