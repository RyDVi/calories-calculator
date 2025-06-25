import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';
import { NutrifiedModel } from 'entities/nutrition';
import { IMAGES_TAGS } from 'shared/consts';

export const Product = types
  .compose(
    'Product',
    NutrifiedModel,
    types.model({
      name: types.string,
      barcode: types.maybeNull(types.string),
      product_info_owner: types.maybeNull(types.string),
    }),
  )
  .views((self) => ({
    get fullName() {
      return `${self.name}, ${self.quantity}${self.unit.name}`;
    },
    get front_image() {
      const imageInfo =
        self.images?.find((data) => data.tag === IMAGES_TAGS.photo_front) ||
        self.images?.[0];

      return imageInfo?.image;
    },
  }));

export type ProductInstance = Instance<typeof Product>;
export type ProductSnapshotIn = SnapshotIn<typeof Product>;
export type ProductSnapshotOut = SnapshotOut<typeof Product>;

export const ProductsFilters = types.model({
  search: types.optional(types.string, ''),
});

export type ProductsFiltersInstance = Instance<typeof ProductsFilters>;
export type ProductsFiltersSnapshotIn = SnapshotIn<typeof ProductsFilters>;
export type ProductsFiltersSnapshotOut = SnapshotOut<typeof ProductsFilters>;

export const ReportProductBug = types.model({
  product: types.reference(Product),
  message: types.string,
});

export type ReportProductBugInstance = Instance<typeof ReportProductBug>;
export type ReportProductBugSnapshotIn = SnapshotIn<typeof ReportProductBug>;
export type ReportProductBugSnapshotOut = SnapshotOut<typeof ReportProductBug>;
