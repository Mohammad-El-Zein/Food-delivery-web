import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Menubar from './components/Menubar/Menubar';
import { Routes, Route } from 'react-router-dom';
import AddFood from './pages/AddFood/AddFood';
import ListFood from './pages/ListFood/ListFood';
import Orders from './pages/Orders/Orders';
import Login from './pages/Login/Login';
import { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { clearToken, getToken } from './services/api';



const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [loggedIn, setLoggedIn] = useState(!!getToken());

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  }

  const logout = () => {
    clearToken();
    setLoggedIn(false);
  }

  // Wird von api.js ausgelöst, wenn der Token abgelaufen ist
  useEffect(() => {
    const onForcedLogout = () => {
      setLoggedIn(false);
      toast.error('Sitzung abgelaufen. Bitte erneut anmelden.');
    };
    window.addEventListener('admin-logout', onForcedLogout);
    return () => window.removeEventListener('admin-logout', onForcedLogout);
  }, []);

  if (!loggedIn) {
    return (
      <>
        <ToastContainer/>
        <Login onLogin={() => setLoggedIn(true)} />
      </>
    )
  }

  return (

    
    <div className="d-flex" id="wrapper">

      <Sidebar sidebarVisible={sidebarVisible} />
            
            <div id="page-content-wrapper">

              <Menubar toggleSidebar={toggleSidebar} onLogout={logout} />
              <ToastContainer/>

                
                <div className="container-fluid">
                  <Routes>
                    <Route path='/add' element={<AddFood />} />
                    <Route path='/list' element={<ListFood />} />
                    <Route path='/orders' element={<Orders />} />
                    <Route path='*' element={<ListFood />} />

                  </Routes>
                    
                </div>
            </div>
        </div>
        
  )
}

export default App;
