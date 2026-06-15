import { useState, useEffect, FormEvent, ReactNode } from "react";
import { motion } from "motion/react";
import { Lock, MousePointerClick, Globe, Monitor, Clock, Loader2, AlertCircle, Trophy, Trash2 } from "lucide-react";

interface StatEntry {
  id: string;
  ip: string;
  country: string;
  browser: string;
  os: string;
  device: string;
  action: string;
  timestamp: string | any;
}

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState<StatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async (pass: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/stats?pass=${encodeURIComponent(pass)}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setIsAuthorized(true);
      } else {
        setError("Неверный пароль или ошибка доступа");
      }
    } catch (err) {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchStats(password);
  };

  const handleClearStats = async () => {
    if (!window.confirm("Вы уверены, что хотите ОЧИСТИТЬ всю статистику?")) return;
    
    try {
      const res = await fetch("/api/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass: password })
      });
      if (res.ok) {
        setStats([]);
      }
    } catch (err) {
      alert("Ошибка при очистке");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#111118] border border-white/5 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-widest">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-2">Введите секретный пароль для просмотра статистики</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-red-500 transition-colors"
              autoFocus
            />
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ВОЙТИ В ПАНЕЛЬ"}
            </button>
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold justify-center mt-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <span className="text-red-500">LNKX</span> STATS
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
              Real-time Visitor Logistics & Engagement
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchStats(password)}
              className="px-6 py-3 bg-[#111118] border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-xs font-black uppercase flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-blue-500" />
              Обновить
            </button>
            <button 
              onClick={handleClearStats}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors text-red-500"
              title="Очистить всё"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Hits" value={stats.length} icon={<MousePointerClick className="text-red-500" />} />
          <StatCard title="Unique IPs" value={new Set(stats.map(s => s.ip)).size} icon={<Globe className="text-blue-500" />} />
          <StatCard title="Top Game" value={stats.filter(s => s.action.startsWith('click_')).length > 0 ? "Mining" : "None"} icon={<Trophy className="text-green-500" />} />
        </div>

        <div className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Time</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Action</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">IP & Geo</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-gray-600 font-bold uppercase text-xs">
                      Нет данных для отображения
                    </td>
                  </tr>
                ) : (
                  stats.map((stat) => (
                    <tr key={stat.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-gray-400">
                          {new Date(stat.timestamp).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider ${
                          stat.action === 'page_view' ? 'bg-blue-500/10 text-blue-500' : 
                          stat.action.includes('click') ? 'bg-green-500/10 text-green-500' : 'bg-white/10 text-white'
                        }`}>
                          {stat.action.replace('click_', '')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{stat.ip}</span>
                          <span className="text-[10px] text-gray-500 uppercase font-black">{stat.country}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Monitor className="w-4 h-4 text-gray-600" />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-300">{stat.device}</span>
                            <span className="text-[9px] text-gray-600">{stat.os} / {stat.browser}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: ReactNode }) {
  return (
    <div className="bg-[#111118] border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-lg">
      <div>
        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center p-3">
        {icon}
      </div>
    </div>
  );
}
