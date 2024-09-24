import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/signIn/LoginPage.tsx";
import HomePage from "./pages/home/home.tsx";
import SignUpPage from "./pages/signUp/signUp.tsx";

export default function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}
