# Entrega backend · GRANJA (1) → COSECHA (N)

Modelo: una **granja** tiene muchas **cosechas**; cada cosecha pertenece a una sola granja.
La FK `ID_GRANJA` vive en `COSECHA` (lado N).

```
GRANJA (ID PK, NOMBRE)  1 ───── N  COSECHA (ID PK, NOMBRE, KILOS, ID_GRANJA FK → GRANJA.ID)
```

| Capa | Archivo |
|---|---|
| Entities | `backend/src/granja/entities/granja.entity.ts` (`@OneToMany`), `backend/src/cosecha/entities/cosecha.entity.ts` (`@ManyToOne` + `@JoinColumn`) |
| Module (repositorios) | `backend/src/cosecha/cosecha.module.ts` → `TypeOrmModule.forFeature([Granja, Cosecha])` |
| Service | `backend/src/cosecha/cosecha.service.ts` (inyecta `Repository<Cosecha>` y `Repository<Granja>`) |
| Controller | `backend/src/cosecha/cosecha.controller.ts` (prefijo `/cosechas`) |
| Datos del Body | `backend/src/cosecha/cosecha.dto.ts` |
| SQL de tablas y datos de prueba | `backend/sql/granja-cosecha.sql` |

## Preparar la base de datos (una vez)

```bash
psql -h localhost -p 5432 -U postgres -d repaso-typescript -W -f backend/sql/granja-cosecha.sql
```

## Arrancar

```bash
cd backend && npm run build && npm start
```

## Las seis funciones

| # | Función | Método y ruta | Entrada |
|---|---|---|---|
| 1 | Añadir un registro | `POST /cosechas` | `@Body` `{ nombre, kilos, granjaId }` |
| 2 | Listar registros | `GET /cosechas` | — |
| 3 | Eliminar el registro elegido | `DELETE /cosechas/:id` | `@Param("id")` |
| 4 | Modificar un campo conservando el ID | `PATCH /cosechas/:id` | `@Param("id")` + `@Body` `{ nombre }` y/o `{ kilos }` |
| 5 | Modificar la clave foránea | `PATCH /cosechas/:id/granja` | `@Param("id")` + `@Body` `{ granjaId }` |
| 6 | INNER JOIN + WHERE | `GET /cosechas/granja/:granjaId` | `@Param("granjaId")` → `WHERE granja.ID = :granjaId` |

Consulta de la función 6:

```sql
SELECT cosecha.*, granja.*
FROM "COSECHA" cosecha
INNER JOIN "GRANJA" granja ON granja."ID" = cosecha."ID_GRANJA"
WHERE granja."ID" = :granjaId
ORDER BY cosecha."ID" ASC;
```

Cada operación devuelve el resultado real leído de la base de datos: la fila creada con su ID,
la fila tras modificarla, la fila eliminada con `filasAfectadas`, o la lista filtrada.
Si el ID de la cosecha o de la granja no existe se responde **404**; si faltan datos o no son válidos, **400**.

Orden de rutas: `PATCH :id/granja` se declara antes que `PATCH :id`, para que la ruta general no oculte la específica.

## Pruebas con curl (Git Bash)

```bash
# 2. Listar
curl -i http://localhost:3000/cosechas

# 1. Añadir
curl -i -X POST http://localhost:3000/cosechas -H "Content-Type: application/json" -d '{"nombre":"Nuez","kilos":620,"granjaId":2}'

# 4. Modificar un campo (el ID se conserva)
curl -i -X PATCH http://localhost:3000/cosechas/1 -H "Content-Type: application/json" -d '{"kilos":950}'

# 5. Cambiar la FK: la cosecha 1 pasa a la granja 3
curl -i -X PATCH http://localhost:3000/cosechas/1/granja -H "Content-Type: application/json" -d '{"granjaId":3}'

# 6. INNER JOIN + WHERE: cosechas de la granja 1
curl -i http://localhost:3000/cosechas/granja/1

# 3. Eliminar
curl -i -X DELETE http://localhost:3000/cosechas/5
```
