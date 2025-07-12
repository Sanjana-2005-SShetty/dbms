import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronRight, ChevronDown, Layers, Users, Home, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import NavLink from './NavLink.jsx';

function Layout({ children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="navbar flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar} 
            className="block md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center ml-2 md:ml-0">
            <Layers className="text-primary-500" size={24} />
            <span className="ml-2 text-xl font-semibold">SkillMatcher</span>
          </div>
        </div>
        
        {/* Profile Menu */}
        <div className="relative">
          <button 
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="hidden md:block">{user?.name || 'User'}</span>
            {profileMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 animate-fade-in">
              <button 
                onClick={() => {
                  navigate('/profile');
                  setProfileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
              >
                <User size={16} className="mr-2" />
                <span>Profile</span>
              </button>
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-error-500 flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
      
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="space-y-1">
          <NavLink to="/" icon={<Home size={20} />} onClick={() => setSidebarOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/projects" icon={<Layers size={20} />} onClick={() => setSidebarOpen(false)}>
            Projects
          </NavLink>
          <NavLink to="/projects/new" icon={<PlusCircle size={20} />} onClick={() => setSidebarOpen(false)}>
            Create Project
          </NavLink>
          <NavLink to="/profile" icon={<User size={20} />} onClick={() => setSidebarOpen(false)}>
            My Profile
          </NavLink>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="main-content flex-1">
        {children}
      </main>
    </div>
  );
}

export default Layout;