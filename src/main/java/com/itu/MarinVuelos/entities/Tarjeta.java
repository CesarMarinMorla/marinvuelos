package com.itu.MarinVuelos.entities;

import com.itu.MarinVuelos.entities.enums.TipoTarjeta;
import com.itu.MarinVuelos.entities.actores.Usuario;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
    private String numero;
    private TipoTarjeta tipoTarjeta;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false) // columna de referencia al usuario
    private Usuario usuario;
}
