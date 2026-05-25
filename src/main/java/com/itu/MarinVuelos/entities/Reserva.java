package com.itu.MarinVuelos.entities;

import com.itu.MarinVuelos.entities.actores.Usuario;
import com.itu.MarinVuelos.entities.logistica.Vuelo;
import com.itu.MarinVuelos.entities.pagos.Pago;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reserva")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reserva extends Base{

    @OneToOne(mappedBy = "reserva")
    private Vuelo vuelo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToOne(mappedBy = "reserva")
    private Pago pago;
}
