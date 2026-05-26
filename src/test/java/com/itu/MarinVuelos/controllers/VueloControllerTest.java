package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.actores.Piloto;
import com.itu.MarinVuelos.entities.logistica.Aerolinea;
import com.itu.MarinVuelos.entities.logistica.Aeropuerto;
import com.itu.MarinVuelos.entities.logistica.Avion;
import com.itu.MarinVuelos.entities.logistica.Vuelo;
import com.itu.MarinVuelos.services.VueloServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class VueloControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockitoBean VueloServiceImpl vueloService;

    private Vuelo vueloValido() {
        Vuelo v = new Vuelo();
        v.setId(1L);
        Aerolinea a = new Aerolinea(); a.setId(1L);
        Avion av = new Avion(); av.setId(1L);
        Piloto p = new Piloto(); p.setId(1L);
        Aeropuerto ap = new Aeropuerto(); ap.setId(1L);
        v.setAerolinea(a);
        v.setAvion(av);
        v.setPiloto(p);
        v.setAeropuertos(List.of(ap));
        v.setFechaSalida(LocalDateTime.of(2026, 6, 1, 10, 0));
        v.setFechaLlegada(LocalDateTime.of(2026, 6, 1, 14, 0));
        return v;
    }

    @Test
    void getAll_returnsOk() throws Exception {
        when(vueloService.findAll()).thenReturn(List.of(vueloValido()));
        mockMvc.perform(get("/api/v1/vuelos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void getOne_notFound_returns404() throws Exception {
        when(vueloService.findById(99L)).thenThrow(new EntityNotFoundException("Entidad no encontrada: 99"));
        mockMvc.perform(get("/api/v1/vuelos/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void save_valid_returnsOk() throws Exception {
        Vuelo v = vueloValido();
        when(vueloService.save(any())).thenReturn(v);
        mockMvc.perform(post("/api/v1/vuelos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(v)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void save_missingFechas_returns400() throws Exception {
        Vuelo v = vueloValido();
        v.setFechaSalida(null);
        mockMvc.perform(post("/api/v1/vuelos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(v)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_notFound_returns404() throws Exception {
        Vuelo v = vueloValido();
        when(vueloService.update(eq(99L), any())).thenThrow(new EntityNotFoundException("Entidad no encontrada: 99"));
        mockMvc.perform(put("/api/v1/vuelos/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(v)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_notFound_returns404() throws Exception {
        when(vueloService.delete(99L)).thenThrow(new EntityNotFoundException("Entidad no encontrada: 99"));
        mockMvc.perform(delete("/api/v1/vuelos/99"))
                .andExpect(status().isNotFound());
    }
}
