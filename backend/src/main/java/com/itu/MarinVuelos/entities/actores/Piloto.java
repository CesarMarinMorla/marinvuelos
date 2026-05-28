package com.itu.MarinVuelos.entities.actores;

import com.itu.MarinVuelos.entities.logistica.Vuelo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** piloto asignado a un vuelo, extiende Persona con su numero de licencia */
@Entity
@Table(name = "piloto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Piloto extends Persona {

    @Column(name = "licencia")
    private String licencia;

}
