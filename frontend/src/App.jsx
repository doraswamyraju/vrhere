import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import PrivateLimitedRegistration from './pages/PrivateLimitedRegistration';
import CustomerDashboard from './pages/CustomerDashboard';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeApp from './pages/EmployeeApp';
import { MessageSquare, Phone } from 'lucide-react';
import SetPassword from './pages/SetPassword';

const FloatingButtons = () => (
  <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a href="https://wa.me/918008530606" target="_blank" rel="noreferrer" className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group relative">
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-full mr-3 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Chat on WhatsApp</span>
      </a>
      <a href="tel:+918008530606" className="bg-black hover:bg-slate-800 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group relative">
          <Phone className="w-6 h-6" />
          <span className="absolute right-full mr-3 bg-black text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Call Expert</span>
      </a>
  </div>
);

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-6 animate-bounce">
          <span className="text-white font-black text-3xl">VR</span>
        </div>
      </div>
    );
  }

return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Routes>
          {/* PUBLIC PAGES */}
          <Route element={<PublicLayout />}>
             <Route path="/" element={<PrivateLimitedRegistration />} />
             <Route path="/services/registration" element={<PrivateLimitedRegistration />} />
             <Route path="/services/*" element={<div className="p-20 text-center text-slate-500">Page Under Construction</div>} />
          </Route>

          {/* AUTHENTICATION */}
          <Route path="/login" element={<LoginPage />} />

          <Route path="/set-password" element={<SetPassword />} />

          {/* PORTALS (No Header/Footer) */}
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/employee" element={<EmployeeApp />} />

        </Routes>
        <FloatingButtons />
      </div>
    </Router>
  );
};

export default App;