# MarinVuelos

Plataforma operativa para la gestión de vuelos, reservas y consultas. Arquitectura fullstack con Spring Boot (Java 17) en el backend y React + TypeScript en el frontend.

---

## Documentacion

Javadoc disponible en [cesarmarinmorla.github.io/MarinVuelos](https://cesarmarinmorla.github.io/MarinVuelos/)

Para regenerar localmente:
```bash
cd backend && ./gradlew javadoc
```

---

## Tecnologías

### Backend
- Java 17
- Spring Boot 4.0.6
- Spring Data JPA + Spring Data REST
- Spring WebMVC + Bean Validation
- Hibernate Envers (auditoría)
- MySQL (producción) / H2 (tests)
- Lombok
- Gradle 9.4.1

### Frontend
- React 19 + TypeScript 6
- React Router DOM 7
- Vite 8
- ESLint + typescript-eslint

---

## Requisitos previos

- JDK 17 o superior
- MySQL corriendo localmente
- Node.js (para el frontend)

```sql
CREATE DATABASE marinvuelos;
```

---

## Configuración

Editar `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/marinvuelos?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=tu_contraseña
```

Hay perfiles disponibles: `dev` y `prod` (`application-dev.properties`, `application-prod.properties`).

---

## Cómo ejecutar

### Backend
```bash
cd backend
./gradlew bootRun
```
API disponible en `http://localhost:8080`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
UI disponible en `http://localhost:5173`.

### Build de producción (frontend)
```bash
npm run build   # genera frontend/dist/
```

---

## Estructura del proyecto

```
MarinVuelos/
├── backend/
│   └── src/main/java/com/itu/MarinVuelos/
│       ├── config/             # Configuración (CORS, etc.)
│       ├── entities/
│       │   ├── actores/        # Usuario, Piloto, Persona
│       │   ├── logistica/      # Vuelo, Avion, Asiento, Tarifa, Aeropuerto, Aerolinea, Ciudad
│       │   ├── pagos/          # Pago, Tarjeta
│       │   └── enums/          # Clase, TipoTarjeta, TipoAvion, TipoTurbina
│       ├── repositories/       # Un repositorio por entidad
│       ├── services/           # Lógica de negocio por agregado
│       └── controllers/        # Endpoints REST (BaseController genérico + especializados)
└── frontend/
    └── src/
        ├── api/                # client.ts — configuración de fetch/axios
        └── pages/
            ├── DashboardOperativo.tsx
            ├── VuelosList.tsx
            ├── VueloNuevo.tsx
            ├── UsuarioNuevo.tsx
            ├── ReservaNueva.tsx
            └── ConsultaNueva.tsx
```

---

## Modelo de dominio

El sistema está **centrado en la administración de vuelos**. Las entidades principales son:

- **Vuelo** — raíz del agregado. Posee tarifas y reservas. Referencia avión, aerolínea, piloto, aeropuerto de origen y destino.
- **Reserva** — vincula un usuario con un asiento en un vuelo. Posee el pago.
- **Usuario** — pasajero. Posee sus tarjetas de pago y su historial de consultas.
- **Avion** — posee sus asientos con disponibilidad.
- **Datos maestros** — `Aeropuerto`, `Ciudad`, `Aerolinea`, `Piloto` existen de forma independiente.

---

## API REST

Todos los controladores extienden `BaseController<T, ID>` que expone CRUD estándar. Controladores disponibles:

| Recurso       | Ruta base              |
|---------------|------------------------|
| Vuelos        | `/api/v1/vuelos`       |
| Reservas      | `/api/v1/reservas`     |
| Usuarios      | `/api/v1/usuarios`     |
| Consultas     | `/api/v1/consultas`    |
| Aerolíneas    | `/api/v1/aerolineas`   |
| Aeropuertos   | `/api/v1/aeropuertos`  |
| Aviones       | `/api/v1/aviones`      |
| Ciudades      | `/api/v1/ciudades`     |
| Pilotos       | `/api/v1/pilotos`      |

Los errores de validación y excepciones son manejados centralmente por `GlobalExceptionHandler`.

---

## Frontend — Rutas

| Ruta                | Página                  |
|---------------------|-------------------------|
| `/`                 | Dashboard operativo     |
| `/vuelos`           | Listado de vuelos       |
| `/usuarios/nuevo`   | Alta de usuario         |
| `/reservas/nueva`   | Nueva reserva           |
| `/consultas`        | Nueva consulta          |

---

## Contexto académico

Proyecto final desarrollado para la materia **Programación Orientada a Objetos**  
Instituto Tecnológico Universitario — Universidad Nacional de Cuyo  
César Marín · 2026

---

## Autor

**César Marín**  
Estudiante de Tecnicatura en Desarrollo de Software — ITU, Universidad Nacional de Cuyo  
[github.com/CesarMarinMorla](https://github.com/CesarMarinMorla)
