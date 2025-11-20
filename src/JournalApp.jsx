import GlobalAlert from './components/GlobalAlert';
import { AppRouter } from './router/AppRouter';
import { AppTheme } from './theme';

export const JournalApp = () => {
  return (
    <AppTheme>
        <AppRouter />
         <GlobalAlert />
    </AppTheme>
  )
}
