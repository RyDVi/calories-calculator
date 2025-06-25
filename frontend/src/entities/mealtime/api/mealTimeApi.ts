import { ProductSnapshotIn } from 'entities/product/@x/mealtime';
import {
  buildApiUrl,
  makeCreateUpdateRequest,
  makeRemoveRequest,
  makeRequest,
} from 'shared/api';
import {
  MealTimeSnapshotIn,
  SaveMealTimeSnapshotIn,
  SaveMealTimeSnapshotOut,
} from '../model/mealTimeModel';

const MEALTIMES_PATH = '/mealtimes';

// Предполагается, что Diary всегда создаётся, даже если отсутствует diary_date (на текущую дату, если это так)
export const loadMealTime = (
  id: string,
  options?: any,
): Promise<MealTimeSnapshotIn> =>
  makeRequest(buildApiUrl(`${MEALTIMES_PATH}/${id}`), options);

export const saveMealTime = makeCreateUpdateRequest<
  SaveMealTimeSnapshotIn,
  SaveMealTimeSnapshotOut
>(MEALTIMES_PATH);

export const removeMealTime = makeRemoveRequest(MEALTIMES_PATH);

interface MealTimeResponse {
  mealtime: MealTimeSnapshotIn;
}
interface ProductResponse {
  product: ProductSnapshotIn;
}

export const recognizeProduct = (
  base64Image: string,
  options?: any,
): Promise<MealTimeResponse | ProductResponse> =>
  makeRequest(buildApiUrl(`${MEALTIMES_PATH}/recognize_product`), {
    ...options,
    method: 'POST',
    body: JSON.stringify({
      image: base64Image,
    }),
  });
