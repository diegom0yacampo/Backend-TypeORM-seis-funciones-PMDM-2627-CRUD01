-- Esquema y datos de prueba para la práctica GRANJA (1) → COSECHA (N)
-- Ejecutar una vez sobre la base "repaso-typescript":
--   psql -h localhost -p 5432 -U postgres -d repaso-typescript -W -f sql/granja-cosecha.sql

CREATE TABLE IF NOT EXISTS "GRANJA" (
  "ID" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "NOMBRE" varchar(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS "COSECHA" (
  "ID" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "NOMBRE" varchar(120) NOT NULL,
  "KILOS" integer NOT NULL,
  "ID_GRANJA" integer NOT NULL,
  CONSTRAINT "FK_COSECHA_GRANJA"
    FOREIGN KEY ("ID_GRANJA") REFERENCES "GRANJA" ("ID")
);

-- Datos de prueba (solo si las tablas están vacías)
INSERT INTO "GRANJA" ("NOMBRE")
SELECT nombre
FROM (VALUES ('Granja El Olivar'), ('Granja Los Almendros'), ('Granja La Vega')) AS v(nombre)
WHERE NOT EXISTS (SELECT 1 FROM "GRANJA");

INSERT INTO "COSECHA" ("NOMBRE", "KILOS", "ID_GRANJA")
SELECT v.nombre, v.kilos, g."ID"
FROM (VALUES
  ('Aceituna', 1200, 'Granja El Olivar'),
  ('Trigo', 800, 'Granja El Olivar'),
  ('Almendra', 450, 'Granja Los Almendros'),
  ('Tomate', 300, 'Granja La Vega'),
  ('Pimiento', 150, 'Granja La Vega')
) AS v(nombre, kilos, granja)
JOIN "GRANJA" g ON g."NOMBRE" = v.granja
WHERE NOT EXISTS (SELECT 1 FROM "COSECHA");

-- Comprobación: cada cosecha con su granja
SELECT c."ID", c."NOMBRE", c."KILOS", c."ID_GRANJA", g."NOMBRE" AS "GRANJA"
FROM "COSECHA" c
INNER JOIN "GRANJA" g ON g."ID" = c."ID_GRANJA"
ORDER BY c."ID" ASC;
