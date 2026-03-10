import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { URL } from '../constants/constantGlogal';

let storeRef = null;
let logoutAction = null;
let showAlertAction = null;

/**
 * Configura la referencia al store de Redux.
 * Se llama una sola vez desde index.js para evitar imports circulares.
 */
export const setupAxiosInterceptors = (store, { logout, showAlert }) => {
  storeRef = store;
  logoutAction = logout;
  showAlertAction = showAlert;
};

/**
 * Verifica si un JWT ha expirado.
 * Retorna true si el token es invalido o ha expirado.
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    // exp esta en segundos, Date.now() en milisegundos
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch {
    return true;
  }
};

/**
 * Obtiene los segundos restantes antes de que expire el token.
 * Retorna 0 si ya expiro o es invalido.
 */
export const getTokenRemainingTime = (token) => {
  if (!token) return 0;
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    const remaining = decoded.exp - now;
    return remaining > 0 ? Math.floor(remaining) : 0;
  } catch {
    return 0;
  }
};

/**
 * Realiza el logout completo: limpia localStorage y despacha la accion de Redux.
 */
export const performLogout = (reason = '') => {
  // Limpiar todo el localStorage relacionado con auth
  localStorage.removeItem('infoUser');
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');

  if (storeRef && logoutAction) {
    storeRef.dispatch(logoutAction());

    if (showAlertAction && reason) {
      storeRef.dispatch(showAlertAction({
        type: 'warning',
        title: 'Sesion finalizada',
        text: reason,
        confirmText: 'Iniciar sesion',
      }));
    }
  }
};

// ─── Instancia centralizada de Axios ───
const api = axios.create({
  baseURL: URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor: inyecta token automaticamente ───
api.interceptors.request.use(
  (config) => {
    if (!storeRef) return config;

    const { authStore } = storeRef.getState();
    const token = authStore?.token;

    if (token) {
      // Verificar expiracion ANTES de enviar la request
      if (isTokenExpired(token)) {
        performLogout('Tu sesion ha expirado. Por favor, inicia sesion nuevamente.');
        return Promise.reject(new axios.Cancel('Token expirado'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: maneja errores 401/403 ───
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        performLogout('Tu sesion ha expirado. Por favor, inicia sesion nuevamente.');
        return Promise.reject(error);
      }

      if (status === 403) {
        if (storeRef && showAlertAction) {
          storeRef.dispatch(showAlertAction({
            type: 'error',
            title: 'Acceso denegado',
            text: 'No tienes permisos para realizar esta accion.',
          }));
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
