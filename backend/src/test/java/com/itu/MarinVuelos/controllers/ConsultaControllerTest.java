package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.Consulta;
import com.itu.MarinVuelos.entities.actores.Usuario;
import com.itu.MarinVuelos.entities.logistica.Vuelo;
import com.itu.MarinVuelos.services.ConsultaServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ConsultaControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockitoBean ConsultaServiceImpl consultaService;

    private Consulta consultaValida() {
        Consulta c = new Consulta();
        c.setId(1L);
        Usuario u = new Usuario(); u.setId(1L);
        Vuelo v = new Vuelo(); v.setId(1L);
        c.setUsuario(u);
        c.setVuelo(v);
        return c;
    }

    @Test
    void getAll_returnsOk() throws Exception {
        when(consultaService.findAll()).thenReturn(List.of(consultaValida()));
        mockMvc.perform(get("/api/v1/consultas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void getOne_notFound_returns404() throws Exception {
        when(consultaService.findById(99L)).thenThrow(new EntityNotFoundException("Entidad no encontrada: 99"));
        mockMvc.perform(get("/api/v1/consultas/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void save_valid_returnsOk() throws Exception {
        Consulta c = consultaValida();
        when(consultaService.save(any())).thenReturn(c);
        mockMvc.perform(post("/api/v1/consultas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(c)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void save_missingUsuario_returns400() throws Exception {
        Consulta c = consultaValida();
        c.setUsuario(null);
        mockMvc.perform(post("/api/v1/consultas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(c)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_notFound_returns404() throws Exception {
        Consulta c = consultaValida();
        when(consultaService.update(eq(99L), any())).thenThrow(new EntityNotFoundException("Entidad no encontrada: 99"));
        mockMvc.perform(put("/api/v1/consultas/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(c)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_notFound_returns404() throws Exception {
        when(consultaService.delete(99L)).thenThrow(new EntityNotFoundException("Entidad no encontrada: 99"));
        mockMvc.perform(delete("/api/v1/consultas/99"))
                .andExpect(status().isNotFound());
    }
}
