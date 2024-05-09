import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import Login from './pages/Login';
import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Overview, Bookings, Parents, Doughnut } from './pages';
import './App.css';

import { UserProvider } from './contexts/UserContext'; // Import UserProvider

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('awesomeLeadsToken'));
  const [currentMode, setCurrentMode] = useState(localStorage.getItem('themeMode') || 'Light');
  const [currentColor, setCurrentColor] = useState(localStorage.getItem('colorMode') || '#007bff');
  const [themeSettings, setThemeSettings] = useState(false);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('themeMode', currentMode);
  }, [currentMode]);

  useEffect(() => {
    localStorage.setItem('colorMode', currentColor);
  }, [currentColor]);

  const handleLogin = (receivedToken) => {
    setToken(receivedToken);
    localStorage.setItem('bb', receivedToken);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem('awesomeLeadsToken');
  };

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <TooltipComponent content="Settings" position="Top">
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: '50%' }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>
          <div className="w-full min-h-screen flex-2">
            <div>
              <UserProvider>
                <Routes>
                  {isLoggedIn ? (
                    <React.Fragment>
                       <Route path="/" element={<Login onLogin={handleLogin} />} />
                      <Route path="/overview" element={
                        <div className=' w-full'>
                        
                        <section className='flex justify-end w-full'>

                        <Sidebar />
                        <div className='w-full md:w-10/12 '>

                        <Navbar />
                      <Overview />
                        </div>
                        </section>
<Footer />
                        </div>
                      } />
                      <Route path="/parents" element={
                       <div className='w-full'>
                        
                        <section className='flex justify-end w-full'>

                        <Sidebar />
                        <div className='w-full md:w-10/12 '>

                        <Navbar />
                      <Parents />
                        </div>
                        </section>
<Footer />
                        </div>} />
                      <Route path="/bookings" element={
                        <div className=' w-full'>
                        
                        <section className='flex justify-end w-full'>

                        <Sidebar />
                        <div className='w-full md:w-10/12 '>

                        <Navbar />
                      <Bookings />
                        </div>
                        </section>
<Footer />
                        </div>
                      } />
                    </React.Fragment>
                  ) : (
                    <Route path="/" element={<Login onLogin={handleLogin} />} />
                  )}
                </Routes>
              </UserProvider>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
