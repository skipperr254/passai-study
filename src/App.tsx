import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Container, Theme } from './settings/types';
import { AuthProvider } from './components/generated/AuthContext';

const theme: Theme = 'light';
// only use 'centered' container for standalone components, never for full page apps or websites.
const container: Container = 'none';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  useEffect(() => {
    setTheme(theme);
  }, []);

  if (container === 'centered') {
    return (
      <AuthProvider>
        <div className="h-full w-full flex flex-col items-center justify-center">
          <Outlet />
        </div>
      </AuthProvider>
    );
  } else {
    return (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    );
  }
}

export default App;