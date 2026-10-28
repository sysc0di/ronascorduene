-- Add the category column that the collections migration replaces.
ALTER TABLE "products" ADD COLUMN "category" TEXT;

UPDATE "products" SET "category" = '' WHERE "category" IS NULL;

ALTER TABLE "products" ALTER COLUMN "category" SET NOT NULL;
