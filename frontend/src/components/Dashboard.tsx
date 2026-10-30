import React from 'react';
import { Sun, Moon, LogOut, CheckCircle, Shield, Activity } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, isDarkMode, setIsDarkMode }) => {
  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-800'}`}>
      <header className={`border-b px-8 py-4 flex justify-between items-center ${isDarkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-slate-200 bg-white'}`}>
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold">
            TE
          </div>
          <span className="text-xl font-bold">Task Engine Dashboard</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-amber-400' : 'bg-white border-slate-200 text-slate-700'}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-400">System Status</span>
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold">Operational</h3>
            <p className="text-xs text-zinc-500 mt-1">All pipelines running smoothly</p>
          </div>

          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-400">Security Level</span>
              <Shield className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold">Enterprise</h3>
            <p className="text-xs text-zinc-500 mt-1">JWT Authenticated</p>
          </div>

          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-400">Active Tasks</span>
              <CheckCircle className="w-5 h-5 text-violet-500" />
            </div>
            <h3 className="text-2xl font-bold">0 Pending</h3>
            <p className="text-xs text-zinc-500 mt-1">Ready for deployment</p>
          </div>
        </div>
      </main>
    </div>
  );
};