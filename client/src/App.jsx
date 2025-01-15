import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Header from './components/Header';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

import UserHeader from './components/UserHeader';
import { useAuthContext } from './hooks/AuthProvider';
import SessionExpired from './pages/SessionExpired';

function App() {
  const location = useLocation();
  const { isLoggedIn } = useAuthContext();
  const NON_PROTECTED_ROUTES = new Set(["/", "/createAccount"])

  const onAuthenticatedPage = NON_PROTECTED_ROUTES.has(location.pathname);

  return (
    <>
      {/* conditionally render userheader */}
      {isLoggedIn && !onAuthenticatedPage ? <UserHeader/> : <Header/>}


      {/* All website routes */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/sessionExpired' element={<SessionExpired/>}/>
        <Route path='/createAccount' element={<CreateAccount/>}/>
        <Route path="/userdashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      </Routes>
    </>
  )
}

export default App
