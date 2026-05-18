package com.itu.MarinVuelos.entities;

import com.itu.MarinVuelos.entities.enums.Clase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "asiento")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Asiento extends Base {

    @Column(name = "fila")
    private int fila;

    @Column(name = "letra")
    private char letra;

    @Enumerated(EnumType.STRING)
    @Column(name = "clase")
    private Clase clase;
}
