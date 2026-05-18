package com.itu.MarinVuelos.entities;

import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public abstract class Pago extends Base {
    protected int cantidad;
}
