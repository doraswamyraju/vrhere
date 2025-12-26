import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Layers, Clock, Menu, Square, Briefcase } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const StatusBadge = ({ status }) => {
  const styles = { 'New': 'bg-indigo-100 text-indigo-700', 'In Progress': 'bg-blue-50 text-blue-700' };
  return <span className={`px-2 py-1 rounded text-xs font-bold ${styles[status]}`}>{status}</span>;
};

export default function EmployeeApp() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const location = useLocation();
  const employeeProfile = location.state || { name: 'Staff Member', role: 'Employee' };

  useEffect(() => {
    const fetchWork = async () => {
      try {
        const res = await fetch('${import.meta.env.VITE_API_URL}/api/employee/projects');
        const data = await res.json();
        setProjects(data);
      } catch (err) { console.error("Error fetching work", err); }
    };
    fetchWork();
  }, []);

  const handleTaskStart = (task) => {
    if (!isClockedIn) { alert("Clock In first!"); return; }
    setActiveTask(task);
  };

  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Projects', label: 'Work Queue', icon: Layers },
    { id: 'Timesheet', label: 'Timesheet', icon: Clock },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      <Sidebar 
        title="Employee"
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-8 gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu size={24}/></button>
            <h1 className="text-xl font-bold text-slate-800">{activeTab}</h1>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
           <div className="space-y-6">
               <div className="bg-slate-900 rounded-3xl p-8 text-white flex justify-between items-center shadow-xl">
                  <div><h2 className="text-2xl font-bold">Welcome, {employeeProfile.name}</h2><p className="text-slate-400">Status: {isClockedIn ? 'Online' : 'Offline'}</p></div>
                  <button onClick={() => setIsClockedIn(!isClockedIn)} className={`px-6 py-3 rounded-xl font-bold ${isClockedIn ? 'bg-rose-500' : 'bg-emerald-500'}`}>{isClockedIn ? 'Clock Out' : 'Clock In'}</button>
               </div>

               {activeTask && (
                 <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full animate-pulse"><Clock /></div>
                        <div><h3 className="font-bold text-slate-800">Working on: {activeTask.title}</h3></div>
                    </div>
                    <button onClick={() => setActiveTask(null)} className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center"><Square size={14} fill="currentColor"/></button>
                 </div>
               )}

               <h3 className="font-bold text-slate-800 text-lg mt-4">Available Work Queue</h3>
               <div className="space-y-3">
                  {projects.map(proj => (
                     <div key={proj._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-slate-700">{proj.title}</h4>
                            <p className="text-xs text-slate-500 mt-1 flex items-center"><Briefcase size={12} className="mr-1"/> {proj.client?.name}</p>
                        </div>
                        <button onClick={() => handleTaskStart(proj)} disabled={!isClockedIn || activeTask} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow disabled:opacity-50">Start</button>
                     </div>
                  ))}
               </div>
           </div>
        </div>
      </main>
    </div>
  );
}