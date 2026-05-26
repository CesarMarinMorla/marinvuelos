package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.Consulta;
import com.itu.MarinVuelos.services.ConsultaServiceImpl;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/consultas")
public class ConsultaController extends BaseControllerImpl<Consulta, ConsultaServiceImpl> {
}
