import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/signIn/LoginPage.tsx";
import HomePage from "./pages/home/home.tsx";
import SignUpPage from "./pages/signUp/signUp.tsx";
import Sidebar from "./components/common/sidebar.tsx"
import RightPanel from "./components/common/rightPanel.tsx";
import NotificationPage from "./pages/notification/notification.tsx";
import ProfilePage from "./pages/profile/profilePage.tsx";
import ToastProvider from "./components/common/toast.tsx";

export default function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar/>
      <ToastProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>
      </ToastProvider>
      <RightPanel/>
    </div>
  );
}
