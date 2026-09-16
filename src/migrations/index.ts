import * as migration_20260902_122545_baseline from './20260902_122545_baseline';
import * as migration_20260916_063011_add_variant_price_override from './20260916_063011_add_variant_price_override';
import * as migration_20260916_065410_make_media_alt_optional from './20260916_065410_make_media_alt_optional';
import * as migration_20260916_084219_add_bundle_item_variant_selection from './20260916_084219_add_bundle_item_variant_selection';

export const migrations = [
  {
    up: migration_20260902_122545_baseline.up,
    down: migration_20260902_122545_baseline.down,
    name: '20260902_122545_baseline',
  },
  {
    up: migration_20260916_063011_add_variant_price_override.up,
    down: migration_20260916_063011_add_variant_price_override.down,
    name: '20260916_063011_add_variant_price_override',
  },
  {
    up: migration_20260916_065410_make_media_alt_optional.up,
    down: migration_20260916_065410_make_media_alt_optional.down,
    name: '20260916_065410_make_media_alt_optional',
  },
  {
    up: migration_20260916_084219_add_bundle_item_variant_selection.up,
    down: migration_20260916_084219_add_bundle_item_variant_selection.down,
    name: '20260916_084219_add_bundle_item_variant_selection'
  },
];
