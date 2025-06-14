import { Authenticated, Unauthenticated } from "convex/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import CreateUserPage from "./pages/CreateUserPage";
import DefaultLayout from "./layout/DefaultLayout";

export default function App() {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Authenticated>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user/:id" element={<UserPage />} />
            <Route path="/create-user" element={<CreateUserPage />} />
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
