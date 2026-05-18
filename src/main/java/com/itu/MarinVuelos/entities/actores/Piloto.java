package com.itu.MarinVuelos.entities.actores;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "piloto")
@Getter
@Setter
@NoArgsConstructor
// @AllArgs genera conflictos en el build
public class Piloto extends Persona {

}
