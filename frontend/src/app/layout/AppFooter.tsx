import { Book as BookIcon, Person as PersonIcon } from '@mui/icons-material';
import { Button, ButtonProps } from '@mui/material';
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { useTranslate } from 'shared/i18n';
import { paths } from 'shared/consts';
import { BottomAppBar } from 'shared/ui';

const FooterButton: React.FC<ButtonProps & LinkProps> = (props) => (
  <Button
    component={Link}
    viewTransition
    variant="text"
    {...props}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      ...props.sx,
    }}
  />
);

export const AppFooter = () => {
  const translate = useTranslate();
  return (
    <BottomAppBar sx={{ bgcolor: 'background.paper', height: 64 }}>
      <FooterButton to={paths.diary({})}>
        <BookIcon />
        {translate('Дневник')}
      </FooterButton>
      <FooterButton to={paths.profile({})}>
        <PersonIcon />
        {translate('Профиль')}
      </FooterButton>
    </BottomAppBar>
  );
};
