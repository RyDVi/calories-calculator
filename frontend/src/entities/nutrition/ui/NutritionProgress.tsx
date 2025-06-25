import {
  Box,
  CircularProgress,
  CircularProgressProps,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from '@mui/material';
import lodash from 'lodash';
import { formatNutritionValue, normalize } from 'shared/lib';

interface NutritionProps {
  value: number;
  target: number;
}

interface CircularNutritionProps
  extends Omit<CircularProgressProps, 'value'>,
    NutritionProps {
  children?: React.ReactNode;
}

interface LinearNutritionProps
  extends Omit<LinearProgressProps, 'value'>,
    NutritionProps {
  label?: React.ReactNode;
}

type NutritionProgressProps =
  | (LinearNutritionProps & { type?: 'linear' })
  | (CircularNutritionProps & { type: 'circular' });

function CircularNutritionProgress({
  target,
  value,
  children,
  ...props
}: CircularNutritionProps) {
  const progress = lodash.clamp(normalize(value, 0, target), 0, 100);
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        sx={(theme) => ({
          position: 'absolute',
          left: 0,
          color: theme.palette.grey[200],
          ...theme.applyStyles('dark', {
            color: theme.palette.grey[800],
          }),
        })}
        {...props}
        value={100}
      />
      <CircularProgress
        color="primary"
        variant="determinate"
        {...(props as CircularProgressProps)}
        value={progress}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'text.secondary' }}
        >
          {children
            ? children
            : `${formatNutritionValue(value)}/${formatNutritionValue(target)}`}
        </Typography>
      </Box>
    </Box>
  );
}

function LinearNutritionProgress({
  target,
  value,
  label,
  ...props
}: LinearNutritionProps) {
  const progress = lodash.clamp(normalize(value, 0, target), 0, 100);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{ color: 'text.secondary', textAlign: 'center' }}
      >
        {label}
      </Typography>
      <LinearProgress
        color="primary"
        variant="determinate"
        {...props}
        value={progress}
      />
      <Typography
        variant="caption"
        component="div"
        sx={{ color: 'text.secondary', textAlign: 'center' }}
      >
        {formatNutritionValue(value)}/{formatNutritionValue(target)}
      </Typography>
    </Box>
  );
}

export function NutritionProgress({ type, ...props }: NutritionProgressProps) {
  if (type === 'circular') {
    return <CircularNutritionProgress {...(props as CircularNutritionProps)} />;
  }
  return <LinearNutritionProgress {...(props as LinearNutritionProps)} />;
}
