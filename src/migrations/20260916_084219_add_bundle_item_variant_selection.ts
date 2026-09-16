import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_bundles_product_items" ADD COLUMN "variant_label" varchar;
  ALTER TABLE "product_bundles_product_items" ADD COLUMN "variant_value" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "product_bundles_product_items" DROP COLUMN "variant_label";
  ALTER TABLE "product_bundles_product_items" DROP COLUMN "variant_value";`)
}
