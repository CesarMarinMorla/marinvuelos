package com.itu.MarinVuelos.entities.actores;


import com.itu.MarinVuelos.entities.Consulta;
import com.itu.MarinVuelos.entities.Reserva;
import com.itu.MarinVuelos.entities.pagos.Tarjeta;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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

    @NotBlank(message = "Correo requerido")
    @Email(message = "Formato de correo inválido")
    @Column(name = "correo")
    private String correo;

    /**
     * Composicion en vez de agregacion (el diagrama original tiene agregacion)
     * Si el usuario se elimina, sus tarjetas se van con el
     */
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tarjeta> tarjetas =  new ArrayList<>();

}
