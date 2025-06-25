import { useCallback, useEffect, useState } from 'react';

type PermissionState = 'granted' | 'denied' | 'prompt' | 'unknown';

export const useNavigatorPermission = (
  permissionName: PermissionName | 'camera',
) => {
  const [permission, setPermission] = useState<PermissionState>('unknown');
  const [isLoading, setIsLoading] = useState(true);

  const checkPermission = useCallback(async () => {
    try {
      if (navigator.permissions) {
        const result = await navigator.permissions.query({
          name: permissionName as PermissionName,
        });
        setPermission(result.state);

        // Слушаем изменения статуса разрешения
        result.onchange = () => {
          setPermission(result.state);
        };
      } else {
        // Если Permissions API не поддерживается, проверяем доступ через getUserMedia
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          setPermission('granted');
        } catch (error: any) {
          if (error.name === 'NotAllowedError') {
            setPermission('denied');
          } else if (error.name === 'NotFoundError') {
            setPermission('denied');
          } else {
            console.error('Ошибка при доступе к камере:', error);
            setPermission('unknown');
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке разрешения камеры:', error);
      setPermission('unknown');
    } finally {
      setIsLoading(false);
    }
  }, [permissionName]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { permission, isLoading };
};
