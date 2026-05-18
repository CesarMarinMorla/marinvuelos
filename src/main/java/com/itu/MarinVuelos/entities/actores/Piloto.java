package com.itu.MarinVuelos.entities.actores;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "piloto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Piloto extends Persona {

}
