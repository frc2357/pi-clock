import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import DefaultLayout from "./layout/DefaultLayout";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Authenticated>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
        </Authenticated>
      </DefaultLayout>
      <Unauthenticated>
        <Navigate to="/login" />
      </Unauthenticated>
    </BrowserRouter>
  );
}

export default App;
