package com.itu.MarinVuelos.entities.logistica;

import com.itu.MarinVuelos.entities.Base;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;

/** dato maestro, existe independiente de los vuelos */
@Entity
@Table(name = "aerolinea")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Aerolinea extends Base {

    @Column(name = "nombre_aerolinea")
    private String nombreAerolinea;
}
