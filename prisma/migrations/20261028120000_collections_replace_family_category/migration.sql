-- Replace the two-level family/category taxonomy with flat collections.
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "collections_slug_key" ON "collections"("slug");

CREATE TABLE "product_collections" (
    "productId" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_collections_pkey" PRIMARY KEY ("productId","collectionId")
);

CREATE INDEX "product_collections_collectionId_idx" ON "product_collections"("collectionId");

ALTER TABLE "product_collections"
    ADD CONSTRAINT "product_collections_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "product_collections"
    ADD CONSTRAINT "product_collections_collectionId_fkey"
    FOREIGN KEY ("collectionId") REFERENCES "collections"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Turn every distinct family and category into a collection. A value that
-- appears in both taxonomies becomes one collection.
WITH taxonomy AS (
    SELECT "family" AS "name" FROM "products" WHERE trim("family") <> ''
    UNION
    SELECT "category" AS "name" FROM "products" WHERE trim("category") <> ''
),
normalized AS (
    SELECT
        trim("name") AS "name",
        trim(
            both '-' from regexp_replace(
                lower(trim("name")),
                '[^a-zA-Z0-9]+',
                '-',
                'g'
            )
        ) AS "slug"
    FROM taxonomy
),
ranked AS (
    SELECT
        "name",
        "slug",
        row_number() OVER (ORDER BY "name") * 10 AS "sortOrder",
        row_number() OVER (PARTITION BY "slug" ORDER BY "name") AS "slugRank"
    FROM normalized
    WHERE trim(
        both '-' from regexp_replace(
            lower(trim("name")),
            '[^a-zA-Z0-9]+',
            '-',
            'g'
        )
    ) <> ''
)
INSERT INTO "collections" (
    "id",
    "name",
    "slug",
    "sortOrder",
    "visible",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid()::text,
    "name",
    "slug",
    "sortOrder",
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM ranked
WHERE "slugRank" = 1;

-- Products keep their current grouping: each one joins the collections
-- created from its family and category values.
INSERT INTO "product_collections" ("productId", "collectionId", "createdAt")
SELECT DISTINCT
    p."id",
    c."id",
    CURRENT_TIMESTAMP
FROM "products" p
JOIN "collections" c
    ON c."name" IN (p."family", p."category")
ON CONFLICT DO NOTHING;

DROP INDEX IF EXISTS "products_family_idx";
DROP INDEX IF EXISTS "products_category_idx";

ALTER TABLE "products" DROP COLUMN "family";
ALTER TABLE "products" DROP COLUMN "category";
