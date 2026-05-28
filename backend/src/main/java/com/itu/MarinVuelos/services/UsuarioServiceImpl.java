package com.itu.MarinVuelos.services;

import com.itu.MarinVuelos.entities.actores.Usuario;
import com.itu.MarinVuelos.entities.enums.TipoTarjeta;
import com.itu.MarinVuelos.entities.pagos.Tarjeta;
import com.itu.MarinVuelos.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;

@Service
public class UsuarioServiceImpl extends BaseServiceImpl<Usuario, Long> implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        super(usuarioRepository);
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Usuario save(Usuario usuario) throws Exception {
        usuario.setPassword(usuario.getDni());
        if (usuario.getTarjetas() == null || usuario.getTarjetas().isEmpty()) {
            Tarjeta tarjeta = new Tarjeta();
            tarjeta.setCantidad(BigDecimal.ZERO);
            tarjeta.setNumeroTarjeta(buildCreditCardNumber(usuario.getDni()));
            tarjeta.setTipoTarjeta(TipoTarjeta.CREDITO);
            tarjeta.setUsuario(usuario);
            usuario.setTarjetas(new ArrayList<>(java.util.List.of(tarjeta)));
        } else {
            usuario.getTarjetas().forEach(tarjeta -> tarjeta.setUsuario(usuario));
        }
        return super.save(usuario);
    }

    private String buildCreditCardNumber(String dni) {
        return String.format("4000%012d", Long.parseLong(dni));
    }

    @Override
    public Usuario update(Long id, Usuario entity) throws Exception {
        Usuario existing = findById(id);
        existing.setNombrePersona(entity.getNombrePersona());
        existing.setApellidoPersona(entity.getApellidoPersona());
        existing.setCorreo(entity.getCorreo());
        existing.setDni(entity.getDni());
        return baseRepository.save(existing);
    }

    @Override
    public Usuario findByCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }
}
