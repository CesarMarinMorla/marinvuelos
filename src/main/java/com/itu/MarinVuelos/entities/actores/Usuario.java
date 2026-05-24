package com.itu.MarinVuelos.entities.actores;


import com.itu.MarinVuelos.entities.pagos.Tarjeta;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario extends Persona {

    @Column(name = "password")
    private String password;

    @Column(name = "correo")
    private String correo;

    /*
    Para tarjetas usaré composicion, decision personal,
    el diagrama tiene agregacion originalmente
    si el usuario es eliminado las tarjetas se deben ir con él
     */
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tarjeta> tarjetas =  new ArrayList<>();


}
