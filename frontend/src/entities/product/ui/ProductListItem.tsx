import {
  Box,
  Chip,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemProps,
  ListItemText,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { NO_IMAGE_PATH } from 'entities/mealtime';
import { MealTimeImage } from 'entities/mealtime/@x/product';
import { NutritionChip } from 'entities/nutrition/@x/product';
import { useTranslate } from 'shared/i18n';
import { ProductInstance } from '../model/productModel';

export const ProductListItem: React.FC<
  {
    product: ProductInstance;
  } & ListItemProps
> = observer(({ product, ...props }) => {
  const translate = useTranslate();
  return (
    <ListItem {...props}>
      <ListItemButton>
        <ListItemIcon sx={{ mr: 1 }}>
          <MealTimeImage
            sx={{
              aspectRatio: '1/1',
              height: 'auto',
              width: '5rem',
              img: {
                objectFit: 'contain',
              },
            }}
            src={product.front_image || NO_IMAGE_PATH}
          />
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
              {product.fullName}
              {product?.nutrition && (
                <NutritionChip
                  nutrition={product.nutrition}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          }
          secondary={
            <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
              {!product.data_accepted && (
                <Chip
                  component="span"
                  size="small"
                  label={translate('Данные не подтверждены')}
                  variant="outlined"
                  color="error"
                />
              )}
              {!!product.product_info_owner && (
                <Chip
                  component="span"
                  size="small"
                  label={product.product_info_owner}
                  title={translate('product_info_owner', {
                    product_info_owner: product.product_info_owner,
                  })}
                  variant="outlined"
                  color="info"
                />
              )}
            </Box>
          }
          secondaryTypographyProps={{ marginTop: '0.3rem', component: 'div' }}
        />
      </ListItemButton>
    </ListItem>
  );
});
