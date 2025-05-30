import {Routes, Route, BrowserRouter, Link, useNavigate, Router} from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from "./pages/Dashboard.tsx";
import {useEffect} from "react";
import './App.css'

function App() {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated
        if (location.pathname !== "/login" && location.pathname !== "/register" && !localStorage.getItem("token")){
            navigate("/login");
        }
    },[])
  return (

          <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
          </Routes>
  )
}

export default App
