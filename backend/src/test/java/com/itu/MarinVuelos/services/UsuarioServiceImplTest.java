package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.actores.Usuario;
import com.itu.MarinVuelos.entities.enums.TipoTarjeta;
import com.itu.MarinVuelos.entities.pagos.Tarjeta;
import com.itu.MarinVuelos.repositories.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
class UsuarioServiceImplTest {

    @Autowired
    private UsuarioServiceImpl usuarioService;

    @MockitoBean
    private UsuarioRepository usuarioRepository;

    @Test
    void save_creaTarjetaDeCreditoAsociada() throws Exception {
        when(usuarioRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        Usuario usuario = new Usuario();
        usuario.setDni("12345678");
        usuario.setNombrePersona("Juan");
        usuario.setApellidoPersona("Perez");
        usuario.setCorreo("juan@example.com");

        Usuario guardado = usuarioService.save(usuario);

        assertThat(guardado.getPassword()).isEqualTo("12345678");
        assertThat(guardado.getTarjetas()).hasSize(1);

        Tarjeta tarjeta = guardado.getTarjetas().get(0);
        assertThat(tarjeta.getCantidad()).isEqualByComparingTo("0");
        assertThat(tarjeta.getTipoTarjeta()).isEqualTo(TipoTarjeta.CREDITO);
        assertThat(tarjeta.getNumeroTarjeta()).isEqualTo("4000000012345678");
        assertThat(tarjeta.getUsuario()).isSameAs(guardado);
    }
}
