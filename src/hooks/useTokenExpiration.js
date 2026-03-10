import { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authStore/authStore';
import { showAlert } from '../store/globalStore/globalStore';
import { isTokenExpired, getTokenRemainingTime } from '../api/axiosInstance';

// Tiempo de advertencia antes de expirar (60 segundos)
const WARNING_BEFORE_EXPIRY_SECONDS = 60;

/**
 * Hook que monitorea la expiracion del JWT token.
 * - Muestra advertencia 60 segundos antes de expirar.
 * - Cierra sesion automaticamente al expirar.
 * - Verifica cada 30 segundos.
 */
export const useTokenExpiration = () => {
  const dispatch = useDispatch();
  const { token, isLogin } = useSelector((state) => state.authStore);
  const intervalRef = useRef(null);
  const warningShownRef = useRef(false);

  const handleExpired = useCallback(() => {
    localStorage.removeItem('infoUser');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    dispatch(logout());
    dispatch(showAlert({
      type: 'warning',
      title: 'Sesion expirada',
      text: 'Tu sesion ha expirado por inactividad. Por favor, inicia sesion nuevamente.',
      confirmText: 'Aceptar',
    }));
  }, [dispatch]);

  const handleWarning = useCallback(() => {
    if (!warningShownRef.current) {
      warningShownRef.current = true;
      dispatch(showAlert({
        type: 'info',
        title: 'Sesion por expirar',
        text: 'Tu sesion expirara pronto. Guarda tu trabajo.',
        confirmText: 'Entendido',
      }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isLogin || !token) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      warningShownRef.current = false;
      return;
    }

    // Verificar inmediatamente al montar
    if (isTokenExpired(token)) {
      handleExpired();
      return;
    }

    // Verificar cada 30 segundos
    intervalRef.current = setInterval(() => {
      if (isTokenExpired(token)) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        handleExpired();
        return;
      }

      const remaining = getTokenRemainingTime(token);
      if (remaining > 0 && remaining <= WARNING_BEFORE_EXPIRY_SECONDS) {
        handleWarning();
      }
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLogin, token, handleExpired, handleWarning]);
};
