package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.Reserva;
import com.itu.MarinVuelos.entities.actores.Usuario;
import com.itu.MarinVuelos.entities.enums.Clase;
import com.itu.MarinVuelos.entities.logistica.Tarifa;
import com.itu.MarinVuelos.entities.logistica.Vuelo;
import com.itu.MarinVuelos.repositories.ReservaRepository;
import com.itu.MarinVuelos.repositories.TarifaRepository;
import com.itu.MarinVuelos.repositories.UsuarioRepository;
import com.itu.MarinVuelos.repositories.VueloRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservaServiceImplTest {

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private VueloRepository vueloRepository;

    @Mock
    private TarifaRepository tarifaRepository;

    private ReservaServiceImpl reservaService;

    @BeforeEach
    void setUp() {
        reservaService = new ReservaServiceImpl(reservaRepository, usuarioRepository, vueloRepository, tarifaRepository);
    }

    @Test
    void save_asociaTarifaValidaAlVuelo() throws Exception {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(vueloRepository.existsById(10L)).thenReturn(true);

        Vuelo vuelo = new Vuelo();
        vuelo.setId(10L);
        Tarifa tarifa = new Tarifa();
        tarifa.setId(20L);
        tarifa.setClaseTarifa(Clase.ECONOMY);
        tarifa.setVuelo(vuelo);

        when(tarifaRepository.findById(20L)).thenReturn(Optional.of(tarifa));
        when(reservaRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Reserva reserva = new Reserva();
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        reserva.setUsuario(usuario);
        reserva.setVuelo(vuelo);
        reserva.setTarifa(new Tarifa());
        reserva.getTarifa().setId(20L);

        Reserva guardada = reservaService.save(reserva);

        assertThat(guardada.getTarifa()).isSameAs(tarifa);
    }

    @Test
    void save_rechazaTarifaDeOtroVuelo() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        when(vueloRepository.existsById(10L)).thenReturn(true);

        Vuelo vuelo = new Vuelo();
        vuelo.setId(10L);
        Tarifa tarifa = new Tarifa();
        tarifa.setId(20L);
        Tarifa otroVuelo = new Tarifa();
        Vuelo vueloDistinto = new Vuelo();
        vueloDistinto.setId(99L);
        otroVuelo.setVuelo(vueloDistinto);
        when(tarifaRepository.findById(20L)).thenReturn(Optional.of(otroVuelo));

        Reserva reserva = new Reserva();
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        reserva.setUsuario(usuario);
        reserva.setVuelo(vuelo);
        reserva.setTarifa(tarifa);

        assertThrows(IllegalArgumentException.class, () -> reservaService.save(reserva));
    }
}
