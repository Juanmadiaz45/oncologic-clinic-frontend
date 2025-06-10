import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { AppLoadingScreen } from '@/components/ui/AppLoadingScreen';
import { protectedRoutes } from '@/routes/protectedRoutes';
import { publicRoutes } from '@/routes/publicRoutes';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';

function App() {
  const { initialize, isInitialized, isLoading, isAuthenticated } = useAuth();

  // Initialize auth on app start
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading screen while initializing
  if (!isInitialized || isLoading) {
    return <AppLoadingScreen />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* =================
              PUBLIC ROUTES
              ================= */}
          {publicRoutes.map((route, index) => (
            <Route
              key={`public-${index}`}
              path={route.path}
              element={route.element}
            />
          ))}

          {/* =================
              PROTECTED ROUTES
              ================= */}
          {protectedRoutes.map((route, index) => (
            <Route
              key={`protected-${index}`}
              path={route.path}
              element={route.element}
            />
          ))}

          {/* =================
              NAVIGATION ROUTES
              ================= */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={ROUTES.DASHBOARD} replace />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to={ROUTES.DASHBOARD} replace />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
