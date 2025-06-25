import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router';
import { paths } from 'shared/consts';
import { isBarCodeText } from 'shared/lib';

export interface LinkToCreateNewProductProps {
  mealTimeId: string;
  diaryUTCDate: string;
  mealTimeName: string;
  barcode?: string;
}

export const LinkToCreateNewProduct: React.FC<
  PropsWithChildren<LinkToCreateNewProductProps>
> = ({ children, mealTimeId, diaryUTCDate, mealTimeName, barcode }) => (
  <Link
    to={
      paths.productNew({}) +
      '?' +
      new URLSearchParams({
        redirect_uri: paths.mealTimeEdit({
          meal_time_id: mealTimeId,
          diary_date: diaryUTCDate,
          meal_time_name: mealTimeName,
        }),
        ...(barcode && isBarCodeText(barcode) ? { barcode } : {}),
      }).toString()
    }
    viewTransition
  >
    {children}
  </Link>
);
