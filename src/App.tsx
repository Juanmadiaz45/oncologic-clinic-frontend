import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import { ROUTES } from '@/constants';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />

          {/* Default redirect to login */}
          <Route
            path={ROUTES.HOME}
            element={<Navigate to={ROUTES.LOGIN} replace />}
          />

          {/* TODO: Add protected routes here */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <div className="p-8 text-center">Dashboard - Coming Soon!</div>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
