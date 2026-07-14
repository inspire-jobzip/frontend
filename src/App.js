import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthPage } from "./pages/AuthPage";
import { JobNoticesPage } from "./pages/JobNoticesPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<JobNoticesPage />}
      />

      <Route
        path="/jobs"
        element={<JobNoticesPage />}
      />

      <Route
        path="/auth"
        element={<AuthPage />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;