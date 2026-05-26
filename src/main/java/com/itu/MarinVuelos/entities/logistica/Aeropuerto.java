package com.itu.MarinVuelos.entities.logistica;

import com.itu.MarinVuelos.entities.Base;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "aeropuerto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Aeropuerto extends Base {

    @Column(name = "nombre_aeropuerto")
    private String nombreAeropuerto;

    /*
    Referencia al ID de ciudad, evita la repeticion de la misma ciudad en la BD
     */
    @OneToOne
    @JoinColumn(name = "ciudad_id")
    private Ciudad ciudad;

    /*
    Aeropuerto es datos maestros, puede servir en muchos vuelos
    Relación ManyToMany: un aeropuerto en muchos vuelos, un vuelo usa múltiples aeropuertos
     */
    @ManyToMany(mappedBy = "aeropuertos")
    private List<Vuelo> vuelos = new ArrayList<>();
}
