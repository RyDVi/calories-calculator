import { getSnapshot, Instance, types } from 'mobx-state-tree';
import { createModelStore, createMutation, createQuery } from 'mst-query';
import * as uuid from 'uuid';
import { DiaryInstance } from 'entities/diary/@x/mealTime';
import { Product } from 'entities/product/@x/mealtime';
import { getUTCDate } from 'shared/lib';
import { useQueryStore } from 'shared/providers';
import {
  loadMealTime,
  recognizeProduct,
  removeMealTime,
  saveMealTime,
} from '../api/mealTimeApi';
import {
  guardMealTimeName,
  MealTime,
  MealTimeInstance,
  MealTimeNames,
  MealTimeNamesInstance,
  SaveMealTime,
  SaveMealTimeSnapshotIn,
} from '../model/mealTimeModel';

const MealTimeQuery = createQuery('MealTimeQuery', {
  data: types.reference(MealTime),
  request: types.model({ id: types.string, name: types.maybe(MealTimeNames) }),
  endpoint({ request, signal }) {
    if (request.id === 'new') {
      return Promise.resolve({
        id: request.id,
        name: guardMealTimeName(request.name),
        count: 1,
      });
    }
    return loadMealTime(request.id, { signal });
  },
});

const SaveMealTimeMutation = createMutation('SaveMealTimeMutation', {
  data: types.safeReference(MealTime),
  request: SaveMealTime,
  endpoint({ request }) {
    return saveMealTime(getSnapshot(request));
  },
});

const RemoveMealTimeMutation = createMutation('RemoveMealTimeMutation', {
  data: types.safeReference(MealTime),
  request: types.string,
  endpoint({ request }) {
    return removeMealTime(request);
  },
});

const RecognizedInfo = types.model('RecognizedInfo', {
  mealtime: types.maybe(types.safeReference(MealTime)),
  product: types.maybe(types.safeReference(Product)),
});

const RecognizeProductMutation = createMutation('RecognizeProductMutation', {
  data: RecognizedInfo,
  request: types.string,
  async endpoint({ request }) {
    const response = await recognizeProduct(request);
    const data = 'mealtime' in response ? response.mealtime : response.product;
    if (!data.id) {
      data.id = uuid.v4();
    }

    return response;
  },
});

export const MealTimeStore = createModelStore('MealTimeStore', MealTime)
  .props({
    saveMealTimeMutation: types.optional(SaveMealTimeMutation, {}),
    removeMealTimeMutation: types.optional(RemoveMealTimeMutation, {}),
    mealTimeQuery: types.optional(MealTimeQuery, {}),
    copiedMealTime: types.optional(
      types.maybeNull(types.reference(MealTime)),
      null,
    ),
    recognizeProductMutation: types.optional(RecognizeProductMutation, {}),
  })
  .actions((self) => ({
    copyMealTime: (mealTime: MealTimeInstance | null) =>
      (self.copiedMealTime = mealTime),
  }))
  .actions((self) => ({
    pasteMealTime: async (
      diary: DiaryInstance | string,
      mealTimeName: MealTimeNamesInstance,
    ) => {
      const mutation = await self.saveMealTimeMutation.mutate({
        request: {
          ...self.copiedMealTime!,
          id: 'new',
          name: mealTimeName,
          diary_date:
            typeof diary === 'string' ? diary : getUTCDate(diary.date!),
          product_id: self.copiedMealTime!.product!.id,
        } as SaveMealTimeSnapshotIn,
      });
      const { data, error } = mutation;
      if (!error) {
        if (typeof diary !== 'string') {
          diary.addMealTime(data);
        }
        self.copyMealTime(null);
      }
      return mutation;
    },
  }));

type MealTimeStoreInstance = Instance<typeof MealTimeStore>;

export function useMealTimeStore() {
  return useQueryStore().mealTimeStore as MealTimeStoreInstance;
}
