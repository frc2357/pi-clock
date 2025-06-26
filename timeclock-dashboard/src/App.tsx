import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Authenticated, Unauthenticated } from "convex/react";
import DefaultLayout from "./layout/DefaultLayout";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import HomePage from "./pages/HomePage";
import { api } from "../convex/_generated/api";
import { useQuery } from "convex/react";

function App() {
  const authUser = useQuery(api.auth.user);

  useEffect(() => {
    console.log(authUser);
  }, [authUser]);

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
