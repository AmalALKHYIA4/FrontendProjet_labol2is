// components/layouts/VisitorLayout.js
import { Outlet } from 'react-router-dom';
import fullscreen from '../../assets/fullscreen.png';
import { useState } from 'react';

const VisitorLayout = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex items-center justify-between z-10">
        <h1 className="text-xl font-bold">Université Cadi Ayyad / FSTG</h1>
        <img
          src={fullscreen}
          alt="Toggle Sidebar"
          className="cursor-pointer"
          onClick={toggleSidebar}
          style={{ width: '24px', height: '24px' }}
        />
      </header>
      
    </div>
  );
};

export default VisitorLayout;