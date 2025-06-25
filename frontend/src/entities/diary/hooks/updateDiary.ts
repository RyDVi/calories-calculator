import { applySnapshot, getSnapshot } from 'mobx-state-tree';
import { useMutation } from 'mst-query';
import { enqueueSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useTranslate } from 'shared/i18n';
import { DiaryInstance, DiarySnapshotIn } from '../model/diaryModel';
import { useDiaryStore } from '../query/diaryQuery';

export function useUpdateDiary(diary?: DiaryInstance | null) {
  const translate = useTranslate();
  const diaryStore = useDiaryStore();
  const [saveDiaryMutation, { isLoading, error }] = useMutation(
    diaryStore.saveDiaryMutation,
  );

  const updateProfile = useCallback(
    async (profile: Partial<DiarySnapshotIn>) => {
      applySnapshot(diary!, {
        ...getSnapshot(diary as DiaryInstance),
        ...profile,
      } as any);
      const { error } = await saveDiaryMutation({
        request: diary as unknown as DiarySnapshotIn,
      });
      if (!error) {
        enqueueSnackbar(translate('Успешно сохранено!'), {
          variant: 'success',
          autoHideDuration: 2000,
        });
      }
    },
    [diary, saveDiaryMutation, translate],
  );
  return [updateProfile, isLoading, error] as const;
}
