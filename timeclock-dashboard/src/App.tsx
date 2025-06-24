import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";

function App() {
  return (
    <BrowserRouter>
      <DefaultLayout>
        <Routes>{/* <Route path="/login" element={<LoginPage />} /> */}</Routes>
      </DefaultLayout>
    </BrowserRouter>
  );
}

export default App;
