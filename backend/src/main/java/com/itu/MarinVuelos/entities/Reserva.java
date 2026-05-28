package com.itu.MarinVuelos.entities;

import com.itu.MarinVuelos.entities.actores.Usuario;
import com.itu.MarinVuelos.entities.logistica.Vuelo;
import com.itu.MarinVuelos.entities.logistica.Tarifa;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Vincula un usuario con un vuelo y una tarifa, es la raiz de la transaccion de compra */
@Entity
@Table(name = "reserva")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reserva extends Base{

    @NotNull(message = "Usuario requerido")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @NotNull(message = "Vuelo requerido")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vuelo_id", unique = true)
    private Vuelo vuelo;

    @NotNull(message = "Tarifa requerida")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarifa_id", nullable = false)
    private Tarifa tarifa;
}
