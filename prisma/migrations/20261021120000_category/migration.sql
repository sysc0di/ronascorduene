-- Some databases already gained the category column outside migration history.
-- IF NOT EXISTS keeps a fresh database and a drifted one on the same path.
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "category" TEXT;

UPDATE "products" SET "category" = '' WHERE "category" IS NULL;

ALTER TABLE "products" ALTER COLUMN "category" SET NOT NULL;
