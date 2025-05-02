import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import AboutUsPage from "./pages/AboutUsPage";
import { ThemeProvider } from "./components/theme-provider";
import "./styles/styles.css";
import { AuthProvider } from "./lib/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="bucket-list-theme">
      <Router>
        <AuthProvider>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
