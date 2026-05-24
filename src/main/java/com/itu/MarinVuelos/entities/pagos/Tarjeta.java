package com.itu.MarinVuelos.entities.pagos;

import com.itu.MarinVuelos.entities.enums.TipoTarjeta;
import com.itu.MarinVuelos.entities.actores.Usuario;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tarjeta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tarjeta extends Pago {

    @Column(name = "numero_tarjeta")
    private String numeroTarjeta;

    @Column(name = "tipo_tarjeta")
    @Enumerated(EnumType.STRING) // persiste string en vez de indice
    private TipoTarjeta tipoTarjeta;

    @ManyToOne(fetch = FetchType.LAZY) // LAZY para no cargar al usuario con cada Tarjeta
    @JoinColumn(name = "usuario_id", nullable = false) // JoinColumn columna de referencia al usuario
    private Usuario usuario;
}
