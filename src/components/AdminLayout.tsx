import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  IoHomeOutline, 
  IoImageOutline, 
  IoMapOutline, 
  IoMailOutline, 
  IoMenuOutline, 
  IoChevronBack, // Import the chevron icon
  IoLogOutOutline, // Import logout icon
  IoCalendarOutline // Import calendar icon for bookings
} from 'react-icons/io5';
import Logo from './Logo'; // Assuming you have a Logo component
import authService from '../services/auth.service';

// Admin Header Component
interface AdminHeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}
const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/admin/login');
    };

    return (
        <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 shadow-md flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
                 <button 
                    onClick={toggleSidebar} 
                    className="text-white mr-4 p-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                 >
                    {isSidebarOpen ? <IoChevronBack size={24} /> : <IoMenuOutline size={24} />} {/* Use IoChevronBack */}
                 </button>
                 <div className="h-8 mr-3"> {/* Adjust height as needed */}
                   {/* The Logo component uses its own internal styling/colors */}
                   <Logo /> 
                 </div>
                 <h1 className="text-xl font-semibold hidden md:block">Admin Panel</h1>
            </div>
            <div>
                {/* Placeholder for User menu/logout */}
                <button 
                    onClick={handleLogout}
                    className="flex items-center text-white p-2 rounded-md hover:bg-blue-800 transition-colors duration-200"
                >
                    <IoLogOutOutline size={20} className="mr-2"/> 
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </header>
    );
}

// Admin Sidebar Component
interface AdminSidebarProps {
  isSidebarOpen: boolean;
}
const AdminSidebar: React.FC<AdminSidebarProps> = ({ isSidebarOpen }) => {
    const location = useLocation();

    const navItems = [
        { path: '/admin', icon: IoHomeOutline, label: 'Dashboard' },
        { path: '/admin/sliders', icon: IoImageOutline, label: 'Sliders' },
        { path: '/admin/destinations', icon: IoMapOutline, label: 'Destinos' },
        { path: '/admin/subscriptions', icon: IoMailOutline, label: 'Suscripciones' },
        { path: '/admin/bookings', icon: IoCalendarOutline, label: 'Reservas/Cotizaciones' },
    ];

    return (
        <aside className={`bg-gray-800 text-gray-200 transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
            <nav className="flex-grow pt-4">
                <ul>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                        return (
                            <li key={item.path} className="mb-1">
                                <Link 
                                    to={item.path} 
                                    title={item.label} // Tooltip when collapsed
                                    className={`flex items-center py-3 px-4 rounded-md mx-2 transition-colors duration-200 ${
                                        isActive 
                                            ? 'bg-blue-600 text-white font-medium' 
                                            : 'hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <item.icon size={22} className="flex-shrink-0" />
                                    <span className={`ml-4 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            {/* Optional: Add a collapse/expand button at the bottom */}
            {/* <div className="p-4 mt-auto border-t border-gray-700">
                <button onClick={toggleSidebar} className="text-gray-400 hover:text-white w-full flex items-center justify-center">
                    {isSidebarOpen ? <IoChevronBack size={20} /> : <IoChevronForward size={20} />}
                </button>
            </div> */}
        </aside>
    );
}

// Main Admin Layout Component
const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdminHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 overflow-hidden"> {/* Added overflow-hidden */}
        <AdminSidebar isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 p-6 overflow-y-auto"> {/* Added overflow-y-auto */}
          <Outlet /> {/* Child routes will render here */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
