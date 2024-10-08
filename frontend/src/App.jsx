import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import ExplorePage from "./pages/ExplorePage";
import LikesPage from "./pages/LikesPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import { Toaster } from 'react-hot-toast';
import BackgroundSwitcher from "./components/Backgroundswitcher"; // Import the background switcher

function App() {
  return (
    <div className="flex text-white">
      <BackgroundSwitcher /> {/* Background will switch */}
      <Sidebar />
      <div className="max-w-5xl my-5 text-white mx-auto transition-all duration-300 flex-1">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={ <LoginPage />}/>  
          <Route path='/signup' element={<SignUpPage />}/>
          <Route path='/explore' element={<ExplorePage />} />
          <Route path='/likes' element={<LikesPage />} />
        </Routes>
        <Toaster/>
      </div>
    </div>
  );
}

export default App;
