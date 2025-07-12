import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavLink({ to, children, icon, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-primary-50 text-primary-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className={isActive ? 'text-primary-500' : 'text-gray-500'}>
        {icon}
      </span>
      <span>{children}</span>
    </Link>
  );
}

export default NavLink;