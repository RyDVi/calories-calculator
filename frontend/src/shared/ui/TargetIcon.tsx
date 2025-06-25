import { SvgIcon, SvgIconProps } from '@mui/material';

import TargetSvgIcon from '../../../public/target-and-arrow-svgrepo-com.svg?react';

export const TargetIcon: React.FC<
  Omit<SvgIconProps, 'children' | 'component'>
> = (props) => (
  <SvgIcon {...props} component={TargetSvgIcon} viewBox="0 0 512 512" />
);
