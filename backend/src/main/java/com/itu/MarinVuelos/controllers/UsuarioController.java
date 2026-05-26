package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.actores.Usuario;
import com.itu.MarinVuelos.services.UsuarioServiceImpl;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController extends BaseControllerImpl<Usuario, UsuarioServiceImpl> {
}
