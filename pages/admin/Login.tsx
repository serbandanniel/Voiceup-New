
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { dataService } from '../../services/dataService';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErr('');
    
    const success = await dataService.login(user, pass);
    
    if (success) {
        toast.success('Autentificare reușită!');
        onLogin();
    } else {
        const msg = 'Date de autentificare incorecte';
        setErr(msg);
        toast.error(msg);
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#1a0b2e] cursor-auto">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-purple rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-pink rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
       </div>

       <div className="relative z-10 w-full max-w-md p-8 m-4">
           <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-yellow"></div>
              
              <div className="text-center mb-10">
                  <h1 className="font-alfa-slab-one text-4xl text-white mb-2 tracking-wide drop-shadow-md">VoiceUP</h1>
                  <p className="text-violet-200 text-sm font-bold tracking-[0.2em] uppercase">Admin Dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2 group">
                      <label className="text-xs font-bold text-violet-300 uppercase ml-1">Username</label>
                      <input 
                        className="w-full pl-4 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all shadow-inner" 
                        placeholder="Introdu user" 
                        value={user} 
                        onChange={e => setUser(e.target.value)} 
                      />
                  </div>

                  <div className="space-y-2 group">
                      <label className="text-xs font-bold text-violet-300 uppercase ml-1">Parolă</label>
                      <input 
                        type="password"
                        className="w-full pl-4 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all shadow-inner" 
                        placeholder="Introdu parola" 
                        value={pass} 
                        onChange={e => setPass(e.target.value)} 
                      />
                  </div>

                  {err && (
                      <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center gap-2">
                          <span className="text-red-200 text-sm font-bold">{err}</span>
                      </div>
                  )}

                  <button 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-brand-pink/50 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4 relative overflow-hidden group"
                  >
                      {isLoading ? 'Se autentifică...' : 'Accesează Panoul'}
                  </button>
              </form>
              
              <div className="mt-8 text-center">
                  <Link to="/" className="text-violet-300 hover:text-white text-sm font-semibold transition-colors border-b border-transparent hover:border-white pb-1">
                      ← Înapoi la Site
                  </Link>
              </div>
           </div>
       </div>
    </div>
  );
};

export default Login;
