import { buildApiUrl, makeCreateUpdateRequest, makeRequest } from 'shared/api';
import { getUTCDate } from 'shared/lib';
import { DiarySnapshotIn, DiarySnapshotOut } from '../model/diaryModel';

export const getDiary = (
  date: string | Date | null,
  options: any,
): Promise<DiarySnapshotIn> => {
  const dateString = date && typeof date === 'object' ? getUTCDate(date) : date;
  return makeRequest(buildApiUrl(`/diaries/${dateString}`), options);
};

export const saveDiary = makeCreateUpdateRequest<
  DiarySnapshotIn,
  DiarySnapshotOut
>('/diaries', { apiLookupField: 'date' });
