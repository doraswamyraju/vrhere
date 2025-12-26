import logo from '../assets/logo.png'; // <--- Import it
import React from 'react';
import { LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ 
  title,           // e.g., "Admin", "Client Portal"
  menuItems,       // Array of { id, label, icon }
  activeTab,       // Current active tab state
  setActiveTab,    // Function to change tab
  mobileMenuOpen,  // Mobile state (optional, defaults false)
  setMobileMenuOpen // Function to close mobile menu
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored data if necessary
    navigate('/login');
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden" 
          onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 
        w-64 bg-white border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out 
        flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
                <div className="h-16 flex items-center justify-center border-b border-slate-100">
    {/* Replace the old VR box with this: */}
    <img src={logo} alt="VR Here" className="h-10 w-auto object-contain" />
</div>
                <span className="font-bold text-lg text-slate-800">{title}</span>
            </div>
            {/* Close Button (Mobile Only) */}
            <button 
              onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)} 
              className="lg:hidden text-slate-400 hover:text-slate-600"
            >
              <X size={20}/>
            </button>
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button 
                  key={item.id} 
                  onClick={() => {
                    setActiveTab(item.id);
                    if (setMobileMenuOpen) setMobileMenuOpen(false);
                  }} 
                  className={`
                    flex items-center w-full p-3 rounded-xl transition-all duration-200 font-medium text-sm
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                    }
                  `}
                >
                  <Icon size={20} className={isActive ? 'text-white' : ''} />
                  <span className="ml-3">{item.label}</span>
                </button>
              );
            })}
        </div>

        {/* FOOTER (LOGOUT) */}
        <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout} 
              className="flex items-center w-full p-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors font-medium text-sm"
            >
                <LogOut size={20} />
                <span className="ml-3">Logout</span>
            </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;