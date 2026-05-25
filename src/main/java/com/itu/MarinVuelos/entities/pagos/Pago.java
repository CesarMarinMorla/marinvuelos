package com.itu.MarinVuelos.entities.pagos;

import com.itu.MarinVuelos.entities.Base;
import com.itu.MarinVuelos.entities.Reserva;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/*
Decisión personal, uso de clase abstracta en vez de clase concreta.

Herencia Joined, crea dos tablas para la superclase y la subclase (mismo PK y FK)
*/
@Entity
@Table(name = "pago")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
public abstract class Pago extends Base {

    @NotNull
    @Column(name = "cantidad",  precision = 10, scale = 2, nullable = false)
    protected BigDecimal cantidad;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id", nullable = false)
    protected Reserva reserva;
}
