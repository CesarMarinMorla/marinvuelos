package com.itu.MarinVuelos.entities.logistica;

import com.itu.MarinVuelos.entities.Base;
import com.itu.MarinVuelos.entities.Consulta;
import com.itu.MarinVuelos.entities.Reserva;
import com.itu.MarinVuelos.entities.actores.Piloto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vuelo")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Vuelo extends Base {

    /*
    No Cascade para Avion, quiero que tengan ciclo de vida independiente
     */
    @OneToOne(mappedBy = "vuelo")
    private Avion avion;

    /*
    ManyToMany: un vuelo puede pasar por múltiples aeropuertos,
    un aeropuerto es usado por múltiples vuelos
     */
    @ManyToMany
    @JoinTable(
        name = "vuelo_aeropuerto",
        joinColumns = @JoinColumn(name = "vuelo_id"),
        inverseJoinColumns = @JoinColumn(name = "aeropuerto_id")
    )
    private List<Aeropuerto> aeropuertos = new ArrayList<>();

    /*
    Para no duplicar Aerolinea constantemente en la BD
    usaré ManyToOne
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aerolinea_id", nullable = false)
    private Aerolinea aerolinea;

    @OneToMany(mappedBy = "vuelo")
    private ArrayList<Tarifa> tarifas;

    @Column(name = "fecha_salida")
    private LocalDateTime fechaSalida;

    @Column(name = "fecha_llegada")
    private LocalDateTime fechaLlegada;

    /*
    un vuelo real podria tener varios pilotos pero usare OneToOne para este proyecto
     */
    @OneToOne(mappedBy = "vuelo")
    private Piloto piloto;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserva_id")
    private Reserva reserva;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consulta_id")
    private Consulta consulta;
}
