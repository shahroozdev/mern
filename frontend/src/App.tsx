import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/signIn/LoginPage.tsx";
import HomePage from "./pages/home/home.tsx";
import SignUpPage from "./pages/signUp/signUp.tsx";
import Sidebar from "./components/common/sidebar.tsx";
import RightPanel from "./components/common/rightPanel.tsx";
import NotificationPage from "./pages/notification/notification.tsx";
import ProfilePage from "./pages/profile/profilePage.tsx";
import ToastProvider from "./components/common/toast.tsx";
import { useGetData } from "./hooks/customHooks.tsx";
import LoadingSpinner from "./components/common/loadingSpiner.tsx";

export default function App() {
  const {data:user, isLoading, isFetching} = useGetData({url:'/auth/getMe', qKey:'profile', noRetry:true})
  const location = useLocation()
  if(isLoading||isFetching){ return  <div className="h-screen w-screen flex justify-center items-center"><LoadingSpinner size="lg" /></div>}

  return (
    <div className="flex max-w-6xl mx-auto">
      <ToastProvider>
        {user&&<Sidebar />}
        <Routes>
          <Route path="/" element={user?<HomePage />:<Navigate to='/login'/>} />
          <Route path="/signup" element={!user?<SignUpPage />:<Navigate to='/'/>} />
          <Route path="/login" element={!user?<LoginPage />:<Navigate to={location.state?.from || '/'}/>} />
          <Route path="/notifications" element={user?<NotificationPage />:<Navigate to='/login'/>} />
          <Route path="/profile/:username" element={user?<ProfilePage /> :<Navigate to='/login'/>} />
        </Routes>
        {user&&<RightPanel />}
      </ToastProvider>
    </div>
  );
}
