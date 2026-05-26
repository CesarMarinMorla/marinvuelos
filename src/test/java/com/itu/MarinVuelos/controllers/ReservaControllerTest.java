package com.itu.MarinVuelos.controllers;

import com.itu.MarinVuelos.entities.Reserva;
import com.itu.MarinVuelos.entities.actores.Usuario;
import com.itu.MarinVuelos.entities.logistica.Vuelo;
import com.itu.MarinVuelos.services.ReservaServiceImpl;
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
class ReservaControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @MockitoBean ReservaServiceImpl reservaService;

    private Reserva reservaValida() {
        Reserva r = new Reserva();
        r.setId(1L);
        Usuario u = new Usuario(); u.setId(1L);
        Vuelo v = new Vuelo(); v.setId(1L);
        r.setUsuario(u);
        r.setVuelo(v);
        return r;
    }

    @Test
    void getAll_returnsOk() throws Exception {
        when(reservaService.findAll()).thenReturn(List.of(reservaValida()));
        mockMvc.perform(get("/api/v1/reservas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void getOne_notFound_returns404() throws Exception {
        when(reservaService.findById(99L)).thenThrow(new EntityNotFoundException("Entidad no encontrada: 99"));
        mockMvc.perform(get("/api/v1/reservas/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void save_valid_returnsOk() throws Exception {
        Reserva r = reservaValida();
        when(reservaService.save(any())).thenReturn(r);
        mockMvc.perform(post("/api/v1/reservas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(r)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void save_missingUsuario_returns400() throws Exception {
        Reserva r = reservaValida();
        r.setUsuario(null);
        mockMvc.perform(post("/api/v1/reservas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(r)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void update_notFound_returns404() throws Exception {
        Reserva r = reservaValida();
        when(reservaService.update(eq(99L), any())).thenThrow(new EntityNotFoundException("Entidad no encontrada: 99"));
        mockMvc.perform(put("/api/v1/reservas/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(r)))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_notFound_returns404() throws Exception {
        when(reservaService.delete(99L)).thenThrow(new EntityNotFoundException("Entidad no encontrada: 99"));
        mockMvc.perform(delete("/api/v1/reservas/99"))
                .andExpect(status().isNotFound());
    }
}
