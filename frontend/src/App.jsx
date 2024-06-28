import { Navigate, Route, Routes } from "react-router-dom"
import SignUpPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/home/HomePage"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import LoadingSpinner from "./components/common/LoadingSpinner"
import ProtectRoutes from "./ProtectRoutes"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/v2/user/getUser`, {
        credentials: "include"
      });
      const data = await res.json();
      if(data.error) return null;
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }
      console.log(data)
      return data;
    },
    retry:false
  })
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser&& <Sidebar />}
      <Routes>
        
      <Route element={<ProtectRoutes authUser={authUser} />}>
          <Route path='/' element={<HomePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>
        <Route path='/login' element={!authUser ? <LoginPage />:<Navigate to="/" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage />:<Navigate to="/"/>} />
      </Routes>
       {authUser &&  <RightPanel />}
      <Toaster />
    </div>
  )
}

export default App
