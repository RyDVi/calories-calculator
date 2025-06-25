import { getSnapshot, Instance, types } from 'mobx-state-tree';
import {
  createModelStore,
  createMutation,
  createQuery,
  onMutate,
} from 'mst-query';
import { HttpError } from 'shared/api';
import { UTCDate } from 'shared/lib';
import { useQueryStore } from 'shared/providers';
import { getDiary, saveDiary } from '../api/diaryApi';
import { Diary, DiarySnapshotOut } from '../model/diaryModel';

export const DiaryQuery = createQuery('DiaryQuery', {
  data: types.reference(Diary),
  request: types.model({
    date: types.maybeNull(UTCDate),
    fetchTargetOn404: types.maybe(types.boolean),
  }),
  async endpoint({ request, signal }) {
    let result;
    try {
      result = await getDiary(request.date, { signal });
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status === 404) {
          if (request.fetchTargetOn404) {
            const diary = await getDiary(null, { signal });
            diary.date = new Date();
            return diary;
          }
          return Promise.resolve({ id: 'new', date: request.date });
        }
      }
      throw err;
    }
    return result;
  },
});

export const TargetDiaryQuery = createQuery('DiaryQuery', {
  data: types.reference(Diary),
  async endpoint({ signal }) {
    return await getDiary(null, { signal });
  },
});

export const SaveDiaryMutation = createMutation('SaveDiaryMutation', {
  data: types.safeReference(Diary),
  request: types.union(types.reference(Diary), Diary),
  endpoint({ request }) {
    return saveDiary(getSnapshot(request) as DiarySnapshotOut);
  },
});

export const DiaryStore = createModelStore('DiaryStore', Diary)
  .props({
    diaryQuery: types.optional(DiaryQuery, {}),
    targetDiaryQuery: types.optional(TargetDiaryQuery, {}),
    saveDiaryMutation: types.optional(SaveDiaryMutation, {}),
    // TODO: make request to get dates on selected months
    filledUTCDates: types.optional(types.array(types.string), []),
  })
  .actions((self) => ({
    afterCreate() {
      onMutate(self.saveDiaryMutation, (data) => {
        self.diaryQuery.setData(data);
      });
    },
  }));

type DiaryStoreInstance = Instance<typeof DiaryStore>;

export function useDiaryStore() {
  return useQueryStore().diaryStore as DiaryStoreInstance;
}
