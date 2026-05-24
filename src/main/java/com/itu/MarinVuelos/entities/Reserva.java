package com.itu.MarinVuelos.entities;

import com.itu.MarinVuelos.entities.logistica.Vuelo;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
}
