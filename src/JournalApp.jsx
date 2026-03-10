import GlobalAlert from './components/GlobalAlert';
import { AppRouter } from './router/AppRouter';
import { AppTheme } from './theme';
import { useTokenExpiration } from './hooks/useTokenExpiration';

export const JournalApp = () => {
  // Monitorear expiracion del token JWT
  useTokenExpiration();

  return (
    <AppTheme>
        <AppRouter />
         <GlobalAlert />
    </AppTheme>
  )
}
