import { destroy, onAction, types } from 'mobx-state-tree';
import {
  createRootStore,
  onMutate,
  QueryClient,
  createContext,
} from 'mst-query';
import { CategoryStore } from 'entities/category';
import { DiaryStore } from 'entities/diary';
import { DictionariesStore } from 'entities/dictionary';
import { MealTimeStore } from 'entities/mealtime';
import { NutritionStore } from 'entities/nutrition';
import { PrivacyPolicyStore } from 'entities/privacyPolicy';
import { ProductStore } from 'entities/product';
import { StatisticsStore } from 'entities/statistics';
import { UnitStore } from 'entities/unit';
import { UserStore } from 'entities/user';
import { UserSettingsStore } from 'entities/userSettings';
import { registerInterceptor } from 'shared/api';

export const RootStore = createRootStore({
  dictionariesStore: types.optional(DictionariesStore, {}),
  categoryStore: types.optional(CategoryStore, {}),
  unitStore: types.optional(UnitStore, {}),
  diaryStore: types.optional(DiaryStore, {}),
  mealTimeStore: types.optional(MealTimeStore, {}),
  productStore: types.optional(ProductStore, {}),
  userStore: types.optional(UserStore, {}),
  userSettingsStore: types.optional(UserSettingsStore, {}),
  statisticsStore: types.optional(StatisticsStore, {}),
  nutritionsStore: types.optional(NutritionStore, {}),
  privacyPolicyStore: types.optional(PrivacyPolicyStore, {}),
}).actions((self) => ({
  async afterCreate() {
    self.dictionariesStore.dictionariesQuery.refetch();
    self.userSettingsStore.userSettingsQuery.refetch();

    onAction(
      self,
      (action) => {
        if (action.name === 'authorize') {
          self.userSettingsStore.userSettingsQuery.refetch();
        }
        if (action.name === 'logout') {
          self.userSettingsStore.userSettingsQuery.setData(null);
        }
      },
      true,
    );

    onMutate(self.mealTimeStore.removeMealTimeMutation, (data) => {
      if (data) {
        self.diaryStore.diaryQuery.data?.mealtimes.remove(data);
        destroy(data);
      }
    });
  },
}));

// type RootStoreInstance = Instance<typeof RootStore>;
const queryClient = new QueryClient({ RootStore });
queryClient.init();
export const queryClientContext = createContext(queryClient as any);
registerInterceptor((error) => {
  if (error?.status === 401) {
    queryClient.rootStore.userStore.logout();
  }
});
