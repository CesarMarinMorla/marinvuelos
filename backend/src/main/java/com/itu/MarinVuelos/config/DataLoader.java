package com.itu.MarinVuelos.config;

import com.itu.MarinVuelos.entities.actores.Piloto;
import com.itu.MarinVuelos.entities.enums.Clase;
import com.itu.MarinVuelos.entities.enums.TipoAvion;
import com.itu.MarinVuelos.entities.enums.TipoTurbina;
import com.itu.MarinVuelos.entities.logistica.Aerolinea;
import com.itu.MarinVuelos.entities.logistica.Aeropuerto;
import com.itu.MarinVuelos.entities.logistica.Avion;
import com.itu.MarinVuelos.entities.logistica.Ciudad;
import com.itu.MarinVuelos.entities.logistica.Tarifa;
import com.itu.MarinVuelos.entities.logistica.Vuelo;
import com.itu.MarinVuelos.repositories.AerolineaRepository;
import com.itu.MarinVuelos.repositories.AeropuertoRepository;
import com.itu.MarinVuelos.repositories.AvionRepository;
import com.itu.MarinVuelos.repositories.CiudadRepository;
import com.itu.MarinVuelos.repositories.PilotoRepository;
import com.itu.MarinVuelos.repositories.TarifaRepository;
import com.itu.MarinVuelos.repositories.VueloRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    private final CiudadRepository ciudadRepository;
    private final AeropuertoRepository aeropuertoRepository;
    private final AerolineaRepository aerolineaRepository;
    private final AvionRepository avionRepository;
    private final PilotoRepository pilotoRepository;
    private final VueloRepository vueloRepository;
    private final TarifaRepository tarifaRepository;

    public DataLoader(CiudadRepository ciudadRepository,
                      AeropuertoRepository aeropuertoRepository,
                      AerolineaRepository aerolineaRepository,
                      AvionRepository avionRepository,
                      PilotoRepository pilotoRepository,
                      VueloRepository vueloRepository,
                      TarifaRepository tarifaRepository) {
        this.ciudadRepository = ciudadRepository;
        this.aeropuertoRepository = aeropuertoRepository;
        this.aerolineaRepository = aerolineaRepository;
        this.avionRepository = avionRepository;
        this.pilotoRepository = pilotoRepository;
        this.vueloRepository = vueloRepository;
        this.tarifaRepository = tarifaRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            log.info("=== DataLoader iniciando ===");
            if (ciudadRepository.count() == 0) {
                loadMasterData();
            } else {
                log.info("Datos maestros ya precargados, saltando maestros...");
            }

            if (vueloRepository.count() == 0) {
                loadVuelos();
            } else {
                log.info("Vuelos ya precargados, saltando vuelos...");
            }

            if (tarifaRepository.count() == 0) {
                loadTarifas();
            } else {
                log.info("Tarifas ya precargadas, saltando tarifas...");
            }

            log.info("=== DataLoader completado exitosamente ===");
        } catch (Exception e) {
            log.error("Error en DataLoader: ", e);
            throw e;
        }
    }

    private void loadMasterData() {
        log.info("Creando ciudades...");
        Ciudad buenosAires = city("Buenos Aires");
        Ciudad madrid = city("Madrid");
        Ciudad miami = city("Miami");
        Ciudad mexicoCity = city("Mexico City");

        log.info("Creando aeropuertos...");
        airport("Ministro Pistarini", buenosAires);
        airport("Adolfo Suárez", madrid);
        airport("Miami International", miami);
        airport("Benito Juárez", mexicoCity);

        log.info("Creando aerolíneas...");
        airline("Aerolineas Argentinas");
        airline("Iberia");
        airline("LATAM Airlines");
        airline("Viva Aerobus");

        log.info("Creando aviones...");
        plane("Boeing", "737", TipoAvion.NARROW_BODY, TipoTurbina.TURBOFAN);
        plane("Airbus", "A320", TipoAvion.NARROW_BODY, TipoTurbina.TURBOFAN);
        plane("Bombardier", "CRJ", TipoAvion.REGIONAL, TipoTurbina.TURBOFAN);

        log.info("Creando pilotos...");
        pilot("12345678", "Juan", "Pérez", "LIC-001");
        pilot("87654321", "María", "García", "LIC-002");
        pilot("11223344", "Carlos", "López", "LIC-003");
    }

    private void loadVuelos() {
        List<Aerolinea> aerolineas = new ArrayList<>(aerolineaRepository.findAll());
        List<Aeropuerto> aeropuertos = new ArrayList<>(aeropuertoRepository.findAll());
        List<Avion> aviones = new ArrayList<>(avionRepository.findAll());
        List<Piloto> pilotos = new ArrayList<>(pilotoRepository.findAll());

        if (aerolineas.size() < 4 || aeropuertos.size() < 4 || aviones.size() < 3 || pilotos.size() < 3) {
            throw new IllegalStateException("No hay suficiente data maestra para crear vuelos precargados.");
        }

        aerolineas.sort((a, b) -> a.getId().compareTo(b.getId()));
        aeropuertos.sort((a, b) -> a.getId().compareTo(b.getId()));
        aviones.sort((a, b) -> a.getId().compareTo(b.getId()));
        pilotos.sort((a, b) -> a.getId().compareTo(b.getId()));

        List<List<Aeropuerto>> rutas = List.of(
            List.of(aeropuertos.get(0), aeropuertos.get(1)),
            List.of(aeropuertos.get(1), aeropuertos.get(2)),
            List.of(aeropuertos.get(2), aeropuertos.get(3)),
            List.of(aeropuertos.get(3), aeropuertos.get(0)),
            List.of(aeropuertos.get(0), aeropuertos.get(2)),
            List.of(aeropuertos.get(1), aeropuertos.get(3))
        );

        LocalDateTime base = LocalDateTime.of(2026, 6, 1, 6, 0);
        for (int i = 0; i < 40; i++) {
            LocalDateTime salida = base.plusDays(i / 4L).plusHours((i % 4L) * 3L);

            Vuelo vuelo = new Vuelo();
            vuelo.setFechaSalida(salida);
            vuelo.setFechaLlegada(salida.plusHours(2 + (i % 5)));
            vuelo.setAerolinea(aerolineas.get(i % aerolineas.size()));
            vuelo.setAvion(aviones.get(i % aviones.size()));
            vuelo.setPiloto(pilotos.get(i % pilotos.size()));
            vuelo.setAeropuertos(new ArrayList<>(rutas.get(i % rutas.size())));

            vueloRepository.save(vuelo);

            if ((i + 1) % 10 == 0) {
                log.info("Vuelos precargados: {}", i + 1);
            }
        }
    }

    private void loadTarifas() {
        List<Vuelo> vuelos = new ArrayList<>(vueloRepository.findAll());
        if (vuelos.isEmpty()) {
            throw new IllegalStateException("No hay vuelos precargados para crear tarifas.");
        }

        vuelos.sort((a, b) -> a.getId().compareTo(b.getId()));
        for (int i = 0; i < vuelos.size(); i++) {
            Vuelo vuelo = vuelos.get(i);
            BigDecimal base = BigDecimal.valueOf(120 + (i * 8L));
            createTarifa(vuelo, Clase.ECONOMY, base, BigDecimal.valueOf(0.18));
            createTarifa(vuelo, Clase.TURISTA, base.multiply(BigDecimal.valueOf(1.25)), BigDecimal.valueOf(0.18));
            createTarifa(vuelo, Clase.BUSINESS, base.multiply(BigDecimal.valueOf(1.7)), BigDecimal.valueOf(0.18));
        }
    }

    private void createTarifa(Vuelo vuelo, Clase clase, BigDecimal precio, BigDecimal impuestoRate) {
        Tarifa tarifa = new Tarifa();
        tarifa.setVuelo(vuelo);
        tarifa.setClaseTarifa(clase);
        tarifa.setPrecioTarifa(precio.setScale(2, RoundingMode.HALF_UP));
        tarifa.setImpuestoTarifa(precio.multiply(impuestoRate).setScale(2, RoundingMode.HALF_UP));
        tarifaRepository.save(tarifa);
    }

    private Ciudad city(String nombre) {
        Ciudad ciudad = new Ciudad();
        ciudad.setNombreCiudad(nombre);
        return ciudadRepository.save(ciudad);
    }

    private Aeropuerto airport(String nombre, Ciudad ciudad) {
        Aeropuerto aeropuerto = new Aeropuerto();
        aeropuerto.setNombreAeropuerto(nombre);
        aeropuerto.setCiudad(ciudad);
        return aeropuertoRepository.save(aeropuerto);
    }

    private Aerolinea airline(String nombre) {
        Aerolinea aerolinea = new Aerolinea();
        aerolinea.setNombreAerolinea(nombre);
        return aerolineaRepository.save(aerolinea);
    }

    private Avion plane(String marca, String modelo, TipoAvion tipoAvion, TipoTurbina tipoTurbina) {
        Avion avion = new Avion();
        avion.setMarca(marca);
        avion.setModelo(modelo);
        avion.setTipoAvion(tipoAvion);
        avion.setTipoTurbina(tipoTurbina);
        return avionRepository.save(avion);
    }

    private Piloto pilot(String dni, String nombre, String apellido, String licencia) {
        Piloto piloto = new Piloto();
        piloto.setDni(dni);
        piloto.setNombrePersona(nombre);
        piloto.setApellidoPersona(apellido);
        piloto.setLicencia(licencia);
        return pilotoRepository.save(piloto);
    }
}
