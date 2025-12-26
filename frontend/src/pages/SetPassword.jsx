import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error'

  useEffect(() => {
    // Extract data from URL link
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    
    setLoading(true);
    try {
      // We reuse the existing reset-password endpoint
      const res = await fetch('http://localhost:5001/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: token, newPassword: password }),
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus('success');
        setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3s
      } else {
        alert(data.message || "Link expired or invalid");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl text-center max-w-md animate-in zoom-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Password Set!</h2>
                <p className="text-slate-500 mt-2">Your account is now secure. Redirecting to login...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="text-indigo-600" size={32}/>
          </div>
          <h1 className="text-2xl font-bold text-white">Set Your Password</h1>
          <p className="text-slate-400 mt-2 text-sm">Create a secure password to access your dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 mb-4">
                <p className="text-xs text-slate-400 uppercase font-bold">Account Email</p>
                <p className="text-white font-mono">{email || 'Detecting...'}</p>
            </div>

            <input 
              type="password" 
              placeholder="New Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all" 
              required 
            />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-all" 
              required 
            />
            
            <button 
              type="submit" 
              disabled={loading || !email || !token} 
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Set Password & Login'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;