import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, ArrowLeft, KeyRound, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [view, setView] = useState('login'); // 'login', 'forgot', 'reset'
  const [formData, setFormData] = useState({ email: '', password: '', otp: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // 1. HANDLE LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.user.role === 'admin') navigate('/admin', { state: data.user });
        else if (data.user.role === 'employee') navigate('/employee', { state: data.user });
        else navigate('/dashboard', { state: data.user });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "Server connection failed" });
    } finally {
      setLoading(false);
    }
  };

  // 2. SEND OTP
  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (data.success) {
        setView('reset');
        setMessage({ type: 'success', text: "OTP sent! (Check backend console for demo)" });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
       setMessage({ type: 'error', text: "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  // 3. RESET PASSWORD
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp, newPassword: formData.newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setView('login');
        setMessage({ type: 'success', text: "Password updated! Please login." });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (err) {
       setMessage({ type: 'error', text: "Reset failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden p-4">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl font-black text-black">VR</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {view === 'login' ? 'System Login' : view === 'forgot' ? 'Reset Password' : 'Set New Password'}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">VR Here Integrated Platform</p>
        </div>

        {/* ALERTS */}
        {message.text && (
          <div className={`p-3 rounded-xl mb-6 flex items-center text-sm ${message.type === 'error' ? 'bg-rose-500/20 text-rose-200 border border-rose-500/50' : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50'}`}>
            <AlertCircle size={16} className="mr-2"/> {message.text}
          </div>
        )}

        {/* VIEW 1: LOGIN */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={20}/>
              <input name="email" type="email" placeholder="Email Address" onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-400" size={20}/>
              <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all" required />
            </div>
            <div className="text-right">
                <button type="button" onClick={() => setView('forgot')} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">Forgot Password?</button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
            </button>
          </form>
        )}

        {/* VIEW 2: FORGOT PASSWORD */}
        {view === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-slate-400 text-sm text-center mb-2">Enter your email to receive a One-Time Password (OTP).</p>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={20}/>
              <input name="email" type="email" placeholder="Registered Email" onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center">
              {loading ? <Loader2 className="animate-spin" /> : 'Send OTP'}
            </button>
            <button type="button" onClick={() => setView('login')} className="w-full text-slate-400 hover:text-white text-sm font-bold py-2 flex items-center justify-center"><ArrowLeft size={16} className="mr-2"/> Back to Login</button>
          </form>
        )}

        {/* VIEW 3: RESET PASSWORD */}
        {view === 'reset' && (
           <form onSubmit={handleReset} className="space-y-4">
             <div className="relative">
               <KeyRound className="absolute left-4 top-3.5 text-slate-400" size={20}/>
               <input name="otp" type="text" placeholder="Enter OTP (6-digits)" onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all tracking-widest" required />
             </div>
             <div className="relative">
               <Lock className="absolute left-4 top-3.5 text-slate-400" size={20}/>
               <input name="newPassword" type="password" placeholder="New Password" onChange={handleChange} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all" required />
             </div>
             <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center">
               {loading ? <Loader2 className="animate-spin" /> : 'Update Password'}
             </button>
           </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;