package com.itu.MarinVuelos.entities.logistica;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.itu.MarinVuelos.entities.Base;
import com.itu.MarinVuelos.entities.Consulta;
import com.itu.MarinVuelos.entities.Reserva;
import com.itu.MarinVuelos.entities.actores.Piloto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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

    @NotEmpty(message = "Se requiere al menos un aeropuerto")
    @ManyToMany
    @JoinTable(
        name = "vuelo_aeropuerto",
        joinColumns = @JoinColumn(name = "vuelo_id"),
        inverseJoinColumns = @JoinColumn(name = "aeropuerto_id")
    )
    private List<Aeropuerto> aeropuertos = new ArrayList<>();

    @NotNull(message = "Aerolinea requerida")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aerolinea_id", nullable = false)
    private Aerolinea aerolinea;

    @JsonIgnore
    @OneToMany(mappedBy = "vuelo")
    private List<Tarifa> tarifas = new ArrayList<>();

    @NotNull(message = "Fecha de salida requerida")
    @Column(name = "fecha_salida")
    private LocalDateTime fechaSalida;

    @NotNull(message = "Fecha de llegada requerida")
    @Column(name = "fecha_llegada")
    private LocalDateTime fechaLlegada;

    @NotNull(message = "Avion requerido")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avion_id")
    private Avion avion;

    @NotNull(message = "Piloto requerido")
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "piloto_id")
    private Piloto piloto;
}
