import { Avatar, AvatarProps } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useBoolean } from 'shared/lib';
import { NO_IMAGE_PATH } from '../model/mealTimeModel';

export const MealTimeImage: React.FC<
  Omit<AvatarProps, 'src'> & { src?: string | null }
> = observer((props) => {
  const [isImageBroken, setIsImageBroken] = useBoolean();
  return (
    <Avatar
      sx={{
        aspectRatio: '1/1',
        height: 'auto',
        width: '5rem',
        img: { objectFit: 'contain' },
      }}
      {...props}
      onError={setIsImageBroken}
      src={isImageBroken || !props.src ? NO_IMAGE_PATH : props.src}
    />
  );
});
