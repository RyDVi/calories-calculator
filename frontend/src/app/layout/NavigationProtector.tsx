import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUser } from 'shared/auth';
import { paths } from 'shared/consts';
import { getUTCDate } from 'shared/lib';

const NavigationProtector = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!getUser()?.auth_token) {
      if (location.pathname === paths.privacy({})) {
        return;
      }
      navigate(paths.auth({}), { viewTransition: true });
      return;
    }
    if (location.pathname === paths.root({})) {
      navigate(paths.diaryDetail({ diary_date: getUTCDate(new Date()) }), {
        viewTransition: true,
      });
      return;
    }
  }, [location.pathname, navigate]);

  return null;
});

NavigationProtector.displayName = 'RootProtector';

export default NavigationProtector;
