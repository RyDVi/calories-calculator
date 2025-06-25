import { List } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ContextMenu } from 'shared/ui';
import { MealTimeInstance } from '../model/mealTimeModel';
import { MealTimeListItem } from './MealTimeListItem';

export const MealTimesList: React.FC<{
  mealTimes: MealTimeInstance[];
  contextMenuContent: (
    mealTime: MealTimeInstance,
  ) => Parameters<typeof ContextMenu>[0]['content'];
  rightSlot?: (mealTime: MealTimeInstance) => React.ReactNode;
  onClickMealTime?: (mealTime: MealTimeInstance) => void;
}> = observer(
  ({ mealTimes, contextMenuContent, rightSlot, onClickMealTime }) => (
    <List dense disablePadding>
      {mealTimes.map((mealTime) => (
        <ContextMenu key={mealTime.id} content={contextMenuContent(mealTime)}>
          {({ anchorRef, open }) => (
            <MealTimeListItem
              ref={anchorRef as any}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                return onClickMealTime?.(mealTime);
              }}
              onContextMenu={(event) => {
                event.preventDefault();
                open();
              }}
              sx={{
                py: 0,
                pl: 0,
                '.MuiListItemSecondaryAction-root': {
                  display: 'flex',
                  flexDirection: 'column',
                },
                '.MuiListItemButton-root': {
                  paddingRight: '0.5rem',
                },
              }}
              mealTime={mealTime}
              secondaryAction={rightSlot?.(mealTime)}
            />
          )}
        </ContextMenu>
      ))}
    </List>
  ),
);
