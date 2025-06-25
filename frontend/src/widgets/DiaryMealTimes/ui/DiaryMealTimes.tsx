import { Divider } from '@mui/material';

import { observer } from 'mobx-react-lite';
import React from 'react';
import { AddMealTimeButton } from 'features/mealtime/add';
import {
  AddCountMealTimeButton,
  ChangeMealTimeCountModal,
  SubCountMealTimeButton,
} from 'features/mealtime/changeCount';
import { CopyMealTimeMenuItem } from 'features/mealtime/copy';
import { PasteMealTimeButton } from 'features/mealtime/paste';
import { RemoveMealTimeButton } from 'features/mealtime/remove';
import { ReportProductBugMenuItem } from 'features/product/reportBug';
import { DiaryInstance } from 'entities/diary';
import {
  MealTimeGroupListItem,
  MealTimeInstance,
  MealTimesList,
  OrderedMealTimeGroupsList,
} from 'entities/mealtime';

import { getUTCDate } from 'shared/lib';

const MealTimeMenuItems: React.FC<{
  mealTime: MealTimeInstance;
  diaryDate: string;
}> = ({ mealTime, diaryDate }) => (
  <>
    <ReportProductBugMenuItem diaryDate={diaryDate} mealTime={mealTime} />
    <CopyMealTimeMenuItem mealTime={mealTime} />
  </>
);

export const DiaryMealTimes: React.FC<{
  diary: DiaryInstance;
}> = observer(({ diary }) => (
  <OrderedMealTimeGroupsList mealTimeGroups={diary.mealTimeGroups}>
    {(mealTimeName, mealTimes) => (
      <React.Fragment key={mealTimeName}>
        <MealTimeGroupListItem
          name={mealTimeName}
          nutrition={diary.mealTimesGroupsNutritions[mealTimeName]}
          secondaryAction={
            <>
              <PasteMealTimeButton diary={diary} mealTimeName={mealTimeName} />
              <AddMealTimeButton
                diaryDate={getUTCDate(diary.date!)}
                mealTimeName={mealTimeName}
              />
            </>
          }
        />
        <ChangeMealTimeCountModal>
          {(openChangeMealTimeCountModal) => (
            <MealTimesList
              mealTimes={mealTimes}
              onClickMealTime={openChangeMealTimeCountModal}
              contextMenuContent={(mealTime) => (
                <MealTimeMenuItems
                  diaryDate={getUTCDate(diary.date!)}
                  mealTime={mealTime}
                />
              )}
              rightSlot={(mealTime) => (
                <>
                  <RemoveMealTimeButton mealTime={mealTime} />
                  <SubCountMealTimeButton mealTime={mealTime} />
                  <AddCountMealTimeButton mealTime={mealTime} />
                </>
              )}
            />
          )}
        </ChangeMealTimeCountModal>
        <Divider />
      </React.Fragment>
    )}
  </OrderedMealTimeGroupsList>
));
