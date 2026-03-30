/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, Reorder } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { AppId, AppConfig, Theme, THEMES, UserProfile, DEFAULT_PROFILE, HomeItem, FolderConfig, WidgetConfig } from './types';
import { 
  Smartphone, 
  Settings as SettingsIcon, 
  ShoppingBag, 
  Camera as CameraIcon, 
  Cloud, 
  Music as MusicIcon, 
  MessageSquare, 
  Calendar as CalendarIcon, 
  Search,
  Battery,
  Wifi,
  Signal,
  Clock,
  Home,
  ChevronLeft,
  X,
  Palette,
  Bell,
  Lock,
  User,
  Info,
  Globe,
  Mic,
  Volume2,
  Sun,
  Moon,
  Play,
  SkipBack,
  SkipForward,
  Bluetooth,
  Zap,
  Flashlight,
  Mail,
  Shield,
  Accessibility,
  Image as ImageIcon,
  PenTool,
  Gamepad2,
  Grid3X3,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  RefreshCw,
  Heart,
  ShieldAlert,
  Type,
  Calculator,
  FileText,
  Trash2,
  Plus,
  Power,
  Folder,
  FolderPlus,
  MoreVertical,
  LayoutGrid,
  Send,
  Cpu,
  Sparkles,
  Terminal,
  Activity,
  MapPin
} from 'lucide-react';

// --- Home Screen Components ---

const WidgetComponent = ({ widget, accent }: { widget: WidgetConfig, accent: string }) => {
  if (widget.type === 'clock') {
    return (
      <div className="w-full h-full glass rounded-3xl flex flex-col items-center justify-center p-4 relative overflow-hidden group" style={{ border: `1px solid ${accent}30` }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Clock size={32} style={{ color: accent }} className="mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
        <span className="text-2xl font-bold font-display tracking-tighter">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <span className="text-[8px] text-zinc-500 uppercase tracking-widest mt-1 font-bold">Stellar Time</span>
      </div>
    );
  }
  if (widget.type === 'weather') {
    return (
      <div className="w-full h-full glass rounded-3xl flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ border: `1px solid ${accent}30` }}>
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-sky-500/10 blur-2xl rounded-full" />
        <Cloud size={32} className="text-sky-400 mb-2 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" />
        <div className="text-center">
          <span className="text-2xl font-bold tracking-tighter">24°C</span>
          <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-tight">Stellar City</p>
        </div>
      </div>
    );
  }
  if (widget.type === 'music') {
    return (
      <div className="w-full h-full glass rounded-3xl flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ border: `1px solid ${accent}30` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5" />
        <MusicIcon size={32} className="text-pink-500 mb-2 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]" />
        <div className="text-center relative z-10">
          <p className="text-sm font-bold truncate w-full tracking-tight">Stellar Drift</p>
          <p className="text-[10px] text-zinc-400 font-medium">Nebula Collective</p>
        </div>
        <div className="flex gap-2 mt-2 opacity-50">
          <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-white animate-pulse delay-75" />
          <div className="w-1 h-1 rounded-full bg-white animate-pulse delay-150" />
        </div>
      </div>
    );
  }
  if (widget.type === 'calendar') {
    return (
      <div className="w-full h-full glass rounded-3xl flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ border: `1px solid ${accent}30` }}>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.05),transparent_70%)]" />
        <CalendarIcon size={32} className="text-green-500 mb-2 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
        <div className="text-center relative z-10">
          <p className="text-xs font-bold uppercase tracking-widest text-green-500/80">Monday</p>
          <p className="text-2xl font-bold tracking-tighter">MAR 30</p>
          <p className="text-[8px] text-zinc-500 uppercase font-bold mt-1">Nebula Event</p>
        </div>
      </div>
    );
  }
  if (widget.type === 'ai') {
    return (
      <div className="w-full h-full glass rounded-3xl flex flex-col items-center justify-center p-4 relative overflow-hidden" style={{ border: `1px solid ${accent}30` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
        <Sparkles size={32} className="text-indigo-400 mb-2 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
        <div className="text-center relative z-10">
          <p className="text-sm font-bold tracking-tight">Nebula AI</p>
          <p className="text-[10px] text-zinc-400 font-medium">Ready to assist</p>
        </div>
      </div>
    );
  }
  return null;
};

const FolderComponent = ({ folder, apps, onOpenApp, accent }: { folder: FolderConfig, apps: AppConfig[], onOpenApp: (id: AppId) => void, accent: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const folderApps = folder.appIds.map(id => apps.find(a => a.id === id)).filter(Boolean) as AppConfig[];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center gap-2 w-full"
      >
        <div className="w-14 h-14 glass rounded-2xl p-2 grid grid-cols-2 gap-1" style={{ border: `1px solid ${accent}30` }}>
          {folderApps.slice(0, 4).map(app => (
            <div key={app.id} className={`${app.color} rounded-sm w-full h-full flex items-center justify-center`}>
              <app.icon size={10} className="text-white" />
            </div>
          ))}
        </div>
        <span className="text-[10px] text-white font-medium">{folder.name}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-8"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
            <div className="relative glass rounded-[40px] p-8 w-full max-w-sm" style={{ border: `1px solid ${accent}30` }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-display text-white">{folder.name}</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-white/10 rounded-full text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-8">
                {folderApps.map(app => (
                  <button 
                    key={app.id}
                    onClick={() => {
                      onOpenApp(app.id);
                      setIsOpen(false);
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={`${app.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg`}>
                      <app.icon size={28} className="text-white" />
                    </div>
                    <span className="text-[10px] text-white font-medium">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Mock Apps ---

const ProfileApp = ({ profile, setProfile, accent }: { profile: UserProfile, setProfile: (p: UserProfile) => void, accent: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  return (
    <div className="h-full bg-[var(--bg)] text-[var(--fg)] p-6 overflow-y-auto transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display">Profile</h1>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="px-4 py-1 rounded-full text-sm font-bold transition-colors"
          style={{ backgroundColor: accent }}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <img 
            src={isEditing ? tempProfile.avatar : profile.avatar} 
            alt="Avatar" 
            className="w-32 h-32 rounded-full border-4 object-cover mb-4 transition-all"
            style={{ borderColor: `${accent}50` }}
            referrerPolicy="no-referrer"
          />
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer">
              <CameraIcon size={24} />
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="w-full space-y-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Username</label>
              <input 
                type="text" 
                value={tempProfile.username}
                onChange={(e) => setTempProfile({ ...tempProfile, username: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Bio</label>
              <textarea 
                value={tempProfile.bio}
                onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-500 h-24 resize-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Avatar URL</label>
              <input 
                type="text" 
                value={tempProfile.avatar}
                onChange={(e) => setTempProfile({ ...tempProfile, avatar: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-purple-500"
              />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-1">{profile.username}</h2>
            <p className="text-zinc-400 text-sm max-w-xs">{profile.bio}</p>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="space-y-4">
          <div className="glass p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="text-yellow-400" size={20} />
              <span>Nebula Points</span>
            </div>
            <span className="font-bold">1,240</span>
          </div>
          <div className="glass p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="text-blue-400" size={20} />
              <span>Devices</span>
            </div>
            <span className="font-bold">2</span>
          </div>
        </div>
      )}
    </div>
  );
};

const BrowserApp = () => (
  <div className="flex flex-col h-full bg-white text-black">
    <div className="p-4 bg-zinc-100 border-b flex items-center gap-2">
      <div className="flex-1 bg-white rounded-full px-4 py-1 text-sm border flex items-center gap-2">
        <Globe size={14} className="text-zinc-400" />
        <span>google.com</span>
      </div>
    </div>
    <div className="flex-1">
      <iframe 
        src="https://www.google.com/search?igu=1" 
        className="w-full h-full border-none"
        title="Google"
      />
    </div>
  </div>
);

const WeatherApp = () => {
  const [weather, setWeather] = useState<{ temp: string, condition: string, city: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Give me a creative, futuristic weather report for 'Nebula City'. Return ONLY a JSON object with keys 'temp' (string, e.g. '24°C'), 'condition' (string, e.g. 'Stellar Flare'), and 'city' (string, 'Nebula City').",
          config: { responseMimeType: "application/json" }
        });
        const data = JSON.parse(response.text);
        setWeather(data);
      } catch (error) {
        console.error("Weather fetch error:", error);
        setWeather({ temp: "22°C", condition: "Stellar Drift", city: "Nebula City" });
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="h-full bg-gradient-to-b from-blue-400 to-blue-600 p-8 text-white flex flex-col items-center justify-center">
      {loading ? (
        <RefreshCw className="animate-spin" size={48} />
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-light">{weather?.city}</h2>
          <div className="text-8xl font-thin my-4">{weather?.temp}</div>
          <p className="text-xl">{weather?.condition}</p>
          <div className="mt-12 grid grid-cols-4 gap-4">
            {['Mon', 'Tue', 'Wed', 'Thu'].map(day => (
              <div key={day} className="text-center">
                <p className="text-sm opacity-70">{day}</p>
                <Cloud className="mx-auto my-2" size={24} />
                <p className="font-bold">{weather?.temp}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const QuadraisAIApp = () => {
  return (
    <div className="h-full bg-black flex flex-col">
      <div className="p-4 glass border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="text-purple-400" />
          <h1 className="text-xl font-bold font-display">Quadrais AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live System</span>
        </div>
      </div>
      <iframe 
        src="https://quadrais-ai.vercel.app/" 
        className="flex-1 w-full border-none"
        title="Quadrais AI"
      />
    </div>
  );
};

const ComputerHubApp = () => {
  const [stats, setStats] = useState({ cpu: 12, ram: 45, storage: 68, network: 120 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        cpu: Math.floor(Math.random() * 20) + 5,
        ram: Math.floor(Math.random() * 10) + 40,
        storage: 68,
        network: Math.floor(Math.random() * 500) + 50
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bg-[var(--bg)] text-[var(--fg)] p-8 flex flex-col gap-8 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
          <Cpu className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display">Computer Hub</h1>
          <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">System Core v4.2.0</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'CPU Usage', value: `${stats.cpu}%`, icon: Activity, color: 'text-green-400' },
          { label: 'Memory', value: `${stats.ram}%`, icon: Terminal, color: 'text-blue-400' },
          { label: 'Storage', value: `${stats.storage}%`, icon: FileText, color: 'text-purple-400' },
          { label: 'Network', value: `${stats.network} Mbps`, icon: Globe, color: 'text-orange-400' }
        ].map(stat => (
          <div key={stat.label} className="glass p-6 rounded-3xl border border-white/5">
            <stat.icon className={`${stat.color} mb-4`} size={24} />
            <p className="text-xs text-zinc-500 font-bold uppercase mb-1">{stat.label}</p>
            <p className="text-2xl font-display font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 glass rounded-3xl border border-white/5 p-6 flex flex-col gap-4">
        <h3 className="text-sm font-bold uppercase text-zinc-500">Active Processes</h3>
        <div className="space-y-3">
          {['Neural Engine', 'Stellar Comms', 'Nebula AI Core', 'System UI'].map(proc => (
            <div key={proc} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <span className="text-sm">{proc}</span>
              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-bold uppercase">Running</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MusicApp = () => (
  <div className="h-full bg-[var(--bg)] p-8 flex flex-col transition-colors duration-300">
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl mb-8 flex items-center justify-center">
        <MusicIcon size={80} className="text-white opacity-50" />
      </div>
      <h2 className="text-2xl font-bold text-white">Stellar Drift</h2>
      <p className="text-purple-400">Nebula Collective</p>
    </div>
    <div className="pb-12">
      <div className="w-full h-1 bg-zinc-800 rounded-full mb-8">
        <div className="w-1/3 h-full bg-purple-500 rounded-full relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
        </div>
      </div>
      <div className="flex items-center justify-between px-8">
        <SkipBack className="text-white" />
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <Play className="text-black fill-current ml-1" />
        </div>
        <SkipForward className="text-white" />
      </div>
    </div>
  </div>
);

const MessagesApp = () => {
  const [messages, setMessages] = useState([
    { from: 'Nova', text: 'Did you see the meteor shower?', time: '10:24 AM', isMe: false },
    { from: 'Cosmo', text: 'The new Nebula OS is fire!', time: 'Yesterday', isMe: false },
    { from: 'Stellar', text: 'Meeting at the space dock at 5.', time: 'Monday', isMe: false }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { from: 'Me', text: userMsg, time: 'Just now', isMe: true }]);
    
    // Auto-reply logic: "I will text you back"
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'Nebula System', text: 'I will text you back soon!', time: 'Just now', isMe: false }]);
    }, 1500);
  };

  return (
    <div className="h-full bg-[var(--bg)] text-[var(--fg)] flex flex-col transition-colors duration-300">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-2xl font-bold font-display">Messages</h1>
      </div>
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.isMe ? 'bg-blue-600' : 'glass border border-white/5'}`}>
              <div className="flex justify-between mb-1 gap-4">
                <span className={`font-bold text-xs ${msg.isMe ? 'text-white/70' : 'text-purple-400'}`}>{msg.from}</span>
                <span className="text-[10px] text-zinc-500">{msg.time}</span>
              </div>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-white/5 flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        <button 
          onClick={handleSend}
          className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

const CalendarApp = () => (
  <div className="h-full bg-[var(--bg)] text-[var(--fg)] p-6 transition-colors duration-300">
    <h1 className="text-2xl font-bold font-display mb-8">Calendar</h1>
    <div className="grid grid-cols-7 gap-2 mb-8">
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
        <div key={d} className="text-center text-[10px] font-bold text-zinc-500">{d}</div>
      ))}
      {Array.from({ length: 31 }).map((_, i) => (
        <div key={i} className={`aspect-square flex items-center justify-center rounded-lg text-sm ${i === 28 ? 'bg-purple-600 font-bold' : 'hover:bg-white/5'}`}>
          {i + 1}
        </div>
      ))}
    </div>
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Upcoming Events</h3>
      <div className="glass p-4 rounded-2xl border-l-4 border-purple-500">
        <div className="font-bold">Nebula Launch Event</div>
        <div className="text-xs text-zinc-400">2:00 PM - 4:00 PM</div>
      </div>
    </div>
  </div>
);

const EmailsApp = () => (
  <div className="h-full bg-[var(--bg)] text-[var(--fg)] flex flex-col transition-colors duration-300">
    <div className="p-6 border-b border-white/5 flex items-center justify-between">
      <h1 className="text-2xl font-bold font-display">Inbox</h1>
      <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">N</div>
    </div>
    <div className="flex-1 overflow-y-auto">
      {[
        { from: 'Nebula Support', subject: 'Welcome to the Galaxy', body: 'Your account is now active. Explore the stars!', time: '10:00 AM' },
        { from: 'Star Fleet', subject: 'Mission Update', body: 'The next mission to Andromeda is scheduled for next month.', time: 'Yesterday' },
        { from: 'Cosmic Bank', subject: 'Statement Ready', body: 'Your monthly stellar credit statement is now available.', time: 'Mar 25' }
      ].map((email, i) => (
        <div key={i} className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer">
          <div className="flex justify-between mb-1">
            <span className="font-bold text-sm">{email.from}</span>
            <span className="text-[10px] text-zinc-500">{email.time}</span>
          </div>
          <div className="text-sm font-medium mb-1">{email.subject}</div>
          <p className="text-xs text-zinc-400 line-clamp-1">{email.body}</p>
        </div>
      ))}
    </div>
  </div>
);

const PaintApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#9333ea');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="h-full bg-[var(--bg)] flex flex-col transition-colors duration-300">
      <div className="p-4 flex items-center justify-between bg-zinc-950">
        <div className="flex gap-2">
          {['#9333ea', '#ef4444', '#22c55e', '#3b82f6', '#ffffff', '#000000'].map(c => (
            <button 
              key={c} 
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={brushSize} 
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-20 accent-purple-500"
          />
          <button onClick={clear} className="text-xs font-bold text-zinc-400 hover:text-white">CLEAR</button>
        </div>
      </div>
      <canvas 
        ref={canvasRef}
        width={400}
        height={600}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        className="flex-1 w-full h-full bg-white cursor-crosshair"
      />
    </div>
  );
};

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);

  const handleNum = (n: string) => {
    setDisplay(display === '0' ? n : display + n);
  };

  const handleOp = (nextOp: string) => {
    setPrevValue(parseFloat(display));
    setOp(nextOp);
    setDisplay('0');
  };

  const calculate = () => {
    if (prevValue === null || op === null) return;
    const current = parseFloat(display);
    let result = 0;
    if (op === '+') result = prevValue + current;
    if (op === '-') result = prevValue - current;
    if (op === '*') result = prevValue * current;
    if (op === '/') result = prevValue / current;
    setDisplay(result.toString());
    setPrevValue(null);
    setOp(null);
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOp(null);
  };

  return (
    <div className="h-full bg-[var(--bg)] text-[var(--fg)] p-6 flex flex-col transition-colors duration-300">
      <div className="flex-1 flex flex-col justify-end text-right mb-8">
        <div className="text-zinc-500 text-sm h-6">{prevValue} {op}</div>
        <div className="text-6xl font-light overflow-hidden">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        <button onClick={clear} className="aspect-square rounded-full bg-zinc-800 text-xl font-bold flex items-center justify-center">C</button>
        <button onClick={() => handleOp('/')} className="aspect-square rounded-full bg-zinc-800 text-xl font-bold flex items-center justify-center text-purple-400">÷</button>
        <button onClick={() => handleOp('*')} className="aspect-square rounded-full bg-zinc-800 text-xl font-bold flex items-center justify-center text-purple-400">×</button>
        <button onClick={() => handleOp('-')} className="aspect-square rounded-full bg-zinc-800 text-xl font-bold flex items-center justify-center text-purple-400">−</button>
        
        {[7, 8, 9].map(n => <button key={n} onClick={() => handleNum(n.toString())} className="aspect-square rounded-full bg-zinc-900 text-xl font-bold flex items-center justify-center">{n}</button>)}
        <button onClick={() => handleOp('+')} className="aspect-square rounded-full bg-zinc-800 text-xl font-bold flex items-center justify-center text-purple-400">+</button>
        
        {[4, 5, 6].map(n => <button key={n} onClick={() => handleNum(n.toString())} className="aspect-square rounded-full bg-zinc-900 text-xl font-bold flex items-center justify-center">{n}</button>)}
        <button onClick={calculate} className="row-span-2 aspect-[1/2] rounded-full bg-purple-600 text-xl font-bold flex items-center justify-center">=</button>
        
        {[1, 2, 3].map(n => <button key={n} onClick={() => handleNum(n.toString())} className="aspect-square rounded-full bg-zinc-900 text-xl font-bold flex items-center justify-center">{n}</button>)}
        
        <button onClick={() => handleNum('0')} className="col-span-2 rounded-full bg-zinc-900 text-xl font-bold flex items-center justify-center">0</button>
        <button onClick={() => handleNum('.')} className="aspect-square rounded-full bg-zinc-900 text-xl font-bold flex items-center justify-center">.</button>
      </div>
    </div>
  );
};

const NotesApp = () => {
  const [notes, setNotes] = useState<{id: number, text: string}[]>([]);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  const addNote = () => {
    if (!currentNote.trim()) return;
    setNotes([{ id: Date.now(), text: currentNote }, ...notes]);
    setCurrentNote('');
    setIsAdding(false);
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="h-full bg-[var(--bg)] text-[var(--fg)] flex flex-col transition-colors duration-300">
      <div className="p-6 border-b border-[var(--glass-border)] flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Notes</h1>
        <button onClick={() => setIsAdding(true)} className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
          <Plus size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isAdding && (
          <div className="glass p-4 rounded-2xl space-y-4">
            <textarea 
              autoFocus
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Write something..."
              className="w-full bg-transparent border-none outline-none text-sm resize-none h-32"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-zinc-500">CANCEL</button>
              <button onClick={addNote} className="px-4 py-2 bg-purple-600 rounded-full text-xs font-bold">SAVE</button>
            </div>
          </div>
        )}
        {notes.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-600">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>No notes yet</p>
          </div>
        )}
        {notes.map(note => (
          <div key={note.id} className="glass p-4 rounded-2xl group">
            <div className="flex justify-between items-start gap-4">
              <p className="text-sm flex-1 whitespace-pre-wrap">{note.text}</p>
              <button onClick={() => deleteNote(note.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SnakeApp = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameOver) return;
    const move = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          setFood({ x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);
    return () => clearInterval(move);
  }, [dir, food, gameOver]);

  return (
    <div className="h-full bg-[var(--bg)] flex flex-col items-center justify-center p-8 transition-colors duration-300">
      <div className="mb-4 flex justify-between w-full text-white font-bold">
        <span>Score: {score}</span>
        {gameOver && <span className="text-red-500">GAME OVER</span>}
      </div>
      <div 
        className="grid w-full aspect-square bg-zinc-900 border border-white/10 relative"
        style={{ gridTemplateColumns: 'repeat(20, 1fr)', gridTemplateRows: 'repeat(20, 1fr)' }}
      >
        {snake.map((s, i) => (
          <div key={i} className="absolute bg-green-500 w-[5%] h-[5%]" style={{ left: `${s.x * 5}%`, top: `${s.y * 5}%` }} />
        ))}
        <div className="absolute bg-red-500 w-[5%] h-[5%] rounded-full" style={{ left: `${food.x * 5}%`, top: `${food.y * 5}%` }} />
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2">
        <div />
        <button onClick={() => setDir({ x: 0, y: -1 })} className="p-4 bg-white/10 rounded-xl text-white"><ChevronLeft className="rotate-90" /></button>
        <div />
        <button onClick={() => setDir({ x: -1, y: 0 })} className="p-4 bg-white/10 rounded-xl text-white"><ChevronLeft /></button>
        <button onClick={() => setDir({ x: 0, y: 1 })} className="p-4 bg-white/10 rounded-xl text-white"><ChevronLeft className="-rotate-90" /></button>
        <button onClick={() => setDir({ x: 1, y: 0 })} className="p-4 bg-white/10 rounded-xl text-white"><ChevronLeft className="rotate-180" /></button>
      </div>
      {gameOver && <button onClick={() => { setSnake([{ x: 10, y: 10 }]); setGameOver(false); setScore(0); }} className="mt-4 text-purple-400 font-bold">RESTART</button>}
    </div>
  );
};

const MinesweeperApp = () => {
  const [grid, setGrid] = useState<any[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const initGrid = () => {
    const newGrid = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      isMine: Math.random() < 0.15,
      revealed: false,
      neighborMines: 0
    }));
    setGrid(newGrid);
    setGameOver(false);
  };

  useEffect(() => { initGrid(); }, []);

  const reveal = (id: number) => {
    if (gameOver || grid[id].revealed) return;
    if (grid[id].isMine) {
      setGameOver(true);
      setGrid(grid.map(c => ({ ...c, revealed: true })));
      return;
    }
    const newGrid = [...grid];
    newGrid[id].revealed = true;
    setGrid(newGrid);
  };

  return (
    <div className="h-full bg-[var(--bg)] flex flex-col items-center justify-center p-6 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-white mb-6 font-display">Minesweeper</h2>
      <div className="grid grid-cols-10 gap-1 bg-zinc-900 p-2 rounded-xl border border-white/10">
        {grid.map(cell => (
          <button 
            key={cell.id}
            onClick={() => reveal(cell.id)}
            className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold transition-colors ${
              cell.revealed 
                ? (cell.isMine ? 'bg-red-500' : 'bg-zinc-700 text-white') 
                : 'bg-zinc-800 hover:bg-zinc-700'
            }`}
          >
            {cell.revealed && cell.isMine && <X size={12} />}
          </button>
        ))}
      </div>
      <button onClick={initGrid} className="mt-8 bg-white text-black px-6 py-2 rounded-full font-bold text-sm">NEW GAME</button>
    </div>
  );
};

const NotificationCenter = ({ 
  isOpen, 
  onClose, 
  accent, 
  time 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  accent: string,
  time: Date
}) => {
  const notifications = [
    { id: 1, app: 'Messages', title: 'Astra', body: 'The star charts are ready for review.', time: '2m ago', icon: MessageSquare, color: 'bg-blue-500' },
    { id: 2, app: 'System', title: 'Update Available', body: 'NebulaOS 2.1.0 is ready to download.', time: '15m ago', icon: RefreshCw, color: 'bg-blue-600' },
    { id: 3, app: 'Calendar', title: 'Nebula Meeting', body: 'Stellar Council meeting in 30 minutes.', time: '45m ago', icon: CalendarIcon, color: 'bg-green-500' },
    { id: 4, app: 'Emails', title: 'Nova Corp', body: 'Your latest shipment of stardust has arrived.', time: '1h ago', icon: Mail, color: 'bg-indigo-600' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-0 z-[100] glass backdrop-blur-3xl flex flex-col"
        >
          <div className="p-8 pt-16 flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold font-display text-white">Notifications</h2>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">
                  {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {notifications.map((n) => (
                <motion.div 
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass p-4 rounded-3xl border border-white/5 flex gap-4 hover:bg-white/5 transition-colors group"
                >
                  <div className={`${n.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <n.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{n.app}</span>
                      <span className="text-[10px] text-zinc-600">{n.time}</span>
                    </div>
                    <h3 className="font-bold text-white">{n.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{n.body}</p>
                  </div>
                </motion.div>
              ))}
              
              {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-30 gap-4">
                  <Bell size={48} />
                  <p className="font-bold uppercase tracking-widest text-xs">No new alerts</p>
                </div>
              )}
            </div>

            <div className="mt-auto py-6 flex justify-center">
              <button 
                onClick={onClose}
                className="px-8 py-3 glass rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
          
          {/* Swipe Up to Close Indicator */}
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full cursor-pointer"
            onClick={onClose}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AppStoreApp = ({ installedAppIds, onInstall, accent }: { 
  installedAppIds: string[], 
  onInstall: (id: AppId) => void,
  accent: string
}) => {
  const storeApps = [
    { id: 'messages', name: 'Quantum Chat', desc: 'Secure messaging for the stars', icon: MessageSquare, color: 'bg-blue-500' },
    { id: 'computer-hub', name: 'Computer Hub', desc: 'System core management', icon: Cpu, color: 'bg-blue-600' },
    { id: 'calendar', name: 'Star Map', desc: 'Navigate the galaxy', icon: CalendarIcon, color: 'bg-green-500' },
    { id: 'browser', name: 'Nebula Browser', desc: 'Fast and secure browsing', icon: Globe, color: 'bg-purple-500' },
    { id: 'weather', name: 'Weather', desc: 'Real-time stellar forecasts', icon: Cloud, color: 'bg-sky-400' },
    { id: 'music', name: 'Stellar Music', desc: 'The rhythm of the cosmos', icon: MusicIcon, color: 'bg-pink-600' },
    { id: 'emails', name: 'Nebula Mail', desc: 'Cosmic communication', icon: Mail, color: 'bg-indigo-600' },
    { id: 'paint', name: 'Nebula Paint', desc: 'Draw your own galaxy', icon: PenTool, color: 'bg-orange-500' },
    { id: 'snake', name: 'Stellar Snake', desc: 'Classic space snake', icon: Gamepad2, color: 'bg-green-600' },
    { id: 'minesweeper', name: 'Star Sweeper', desc: 'Clear the minefield', icon: Grid3X3, color: 'bg-zinc-700' },
    { id: 'calculator', name: 'Nebula Calc', desc: 'Stellar calculations', icon: Calculator, color: 'bg-orange-600' },
    { id: 'notes', name: 'Nebula Notes', desc: 'Keep your thoughts in orbit', icon: FileText, color: 'bg-yellow-600' },
    { id: 'maps', name: 'Nebula Maps', desc: 'Navigate the digital cosmos', icon: MapPin, color: 'bg-green-600' },
  ];

  const thirdPartyApps = [
    { id: 'quadrais-ai', name: 'Quadrais AI', desc: 'Advanced neural intelligence', icon: Sparkles, color: 'bg-purple-600' },
  ];

  const widgets = [
    { id: 'clock', name: 'Stellar Clock', type: 'clock', icon: Clock, color: 'bg-zinc-800' },
    { id: 'weather', name: 'Nebula Weather', type: 'weather', icon: Cloud, color: 'bg-sky-500' },
    { id: 'music', name: 'Music Player', type: 'music', icon: MusicIcon, color: 'bg-pink-600' },
    { id: 'calendar', name: 'Calendar', type: 'calendar', icon: CalendarIcon, color: 'bg-green-600' },
    { id: 'ai', name: 'Nebula AI', type: 'ai', icon: Sparkles, color: 'bg-indigo-600' },
  ];

  const [addedWidgetId, setAddedWidgetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'apps' | 'widgets' | 'third-party'>('apps');

  return (
    <div className="h-full bg-[var(--bg)] text-[var(--fg)] flex flex-col transition-colors duration-300">
      <div className="p-6 pb-2">
        <h1 className="text-4xl font-bold mb-6 font-display">Nebula Store</h1>
        <div className="flex gap-4 border-b border-white/10 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('apps')}
            className={`pb-2 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === 'apps' ? 'text-white' : 'text-zinc-500'}`}
          >
            APPS
            {activeTab === 'apps' && <motion.div layoutId="store-tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />}
          </button>
          <button 
            onClick={() => setActiveTab('third-party')}
            className={`pb-2 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === 'third-party' ? 'text-white' : 'text-zinc-500'}`}
          >
            3RD PARTY
            {activeTab === 'third-party' && <motion.div layoutId="store-tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />}
          </button>
          <button 
            onClick={() => setActiveTab('widgets')}
            className={`pb-2 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === 'widgets' ? 'text-white' : 'text-zinc-500'}`}
          >
            WIDGETS
            {activeTab === 'widgets' && <motion.div layoutId="store-tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'apps' && (
            <motion.div 
              key="apps"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {storeApps.map(app => {
                const isInstalled = installedAppIds.includes(app.id);
                return (
                  <div key={app.id} className="glass p-4 rounded-2xl flex items-center gap-4">
                    <div className={`${app.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}>
                      <app.icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{app.name}</h3>
                      <p className="text-xs text-zinc-400">{app.desc}</p>
                    </div>
                    <button 
                      onClick={() => onInstall(app.id as AppId)}
                      className={`text-xs font-bold px-4 py-2 rounded-full transition-colors`}
                      style={{ 
                        backgroundColor: isInstalled ? 'rgba(255,255,255,0.1)' : accent,
                        color: isInstalled ? 'rgba(255,255,255,0.5)' : 'white'
                      }}
                    >
                      {isInstalled ? 'OPEN' : 'GET'}
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'third-party' && (
            <motion.div 
              key="third-party"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {thirdPartyApps.map(app => {
                const isInstalled = installedAppIds.includes(app.id);
                return (
                  <div key={app.id} className="glass p-4 rounded-2xl flex items-center gap-4">
                    <div className={`${app.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}>
                      <app.icon size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{app.name}</h3>
                      <p className="text-xs text-zinc-400">{app.desc}</p>
                    </div>
                    <button 
                      onClick={() => onInstall(app.id as AppId)}
                      className={`text-xs font-bold px-4 py-2 rounded-full transition-colors`}
                      style={{ 
                        backgroundColor: isInstalled ? 'rgba(255,255,255,0.1)' : accent,
                        color: isInstalled ? 'rgba(255,255,255,0.5)' : 'white'
                      }}
                    >
                      {isInstalled ? 'OPEN' : 'GET'}
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'widgets' && (
            <motion.div 
              key="widgets"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-2 gap-4"
            >
              {widgets.map(w => (
                <div key={w.id} className="glass p-4 rounded-2xl flex flex-col items-center gap-3 text-center relative overflow-hidden group">
                  <div className={`${w.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <w.icon size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{w.name}</h3>
                  </div>
                  <button 
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('nebula_add_widget', { detail: w.type }));
                      setAddedWidgetId(w.id);
                      setTimeout(() => setAddedWidgetId(null), 2000);
                    }}
                    className={`text-[10px] font-bold px-4 py-2 rounded-full transition-all ${
                      addedWidgetId === w.id ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {addedWidgetId === w.id ? 'ADDED' : 'ADD TO HOME'}
                  </button>
                  {addedWidgetId === w.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm"
                    >
                      <span className="text-[10px] font-bold text-green-400">WIDGET ADDED</span>
                    </motion.div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ACCENT_COLORS = [
  { id: 'purple', name: 'Purple', class: 'bg-purple-600', text: 'text-purple-500', hex: '#9333ea' },
  { id: 'blue', name: 'Blue', class: 'bg-blue-600', text: 'text-blue-500', hex: '#2563eb' },
  { id: 'pink', name: 'Pink', class: 'bg-pink-600', text: 'text-pink-500', hex: '#db2777' },
  { id: 'cyan', name: 'Cyan', class: 'bg-cyan-500', text: 'text-cyan-400', hex: '#06b6d4' },
  { id: 'green', name: 'Green', class: 'bg-green-600', text: 'text-green-500', hex: '#16a34a' },
  { id: 'orange', name: 'Orange', class: 'bg-orange-600', text: 'text-orange-500', hex: '#ea580c' },
];

const MapsApp = ({ accent }: { accent: string }) => {
  const [search, setSearch] = useState('');
  const [mapUrl, setMapUrl] = useState('https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1648640000000!5m2!1sen!2sus');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    // Simulate search by updating the embed URL with a search query
    const encodedSearch = encodeURIComponent(search);
    setMapUrl(`https://www.google.com/maps?q=${encodedSearch}&output=embed`);
  };

  return (
    <div className="h-full bg-zinc-950 flex flex-col overflow-hidden">
      <div className="p-4 glass border-b border-white/10 flex items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Nebula Maps..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-sm focus:outline-none focus:border-white/20 transition-all"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        </form>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
          <MapPin size={20} style={{ color: accent }} />
        </div>
      </div>
      <div className="flex-1 relative">
        <iframe 
          src={mapUrl}
          className="w-full h-full border-none grayscale-[0.2] contrast-[1.1]"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <button className="w-12 h-12 rounded-full bg-white text-black shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
            <Plus size={24} />
          </button>
          <button 
            onClick={() => setMapUrl('https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1648640000000!5m2!1sen!2sus')}
            className="w-12 h-12 rounded-full glass shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MapPin size={24} style={{ color: accent }} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsApp = ({ 
  theme, 
  setTheme, 
  accent, 
  setAccent,
  profile, 
  setProfile, 
  onOpenProfile,
  wallpaper,
  setWallpaper,
  reduceMotion,
  setReduceMotion,
  deviceName,
  setDeviceName,
  navigationMode,
  setNavigationMode,
  isDarkMode,
  setIsDarkMode,
  installedAppIds,
  apps,
  onUninstall,
  onPowerOff,
  onRestart
}: { 
  theme: Theme, 
  setTheme: (t: Theme) => void,
  accent: string,
  setAccent: (a: string) => void,
  profile: UserProfile,
  setProfile: (p: UserProfile) => void,
  onOpenProfile: () => void,
  wallpaper: string,
  setWallpaper: (w: string) => void,
  reduceMotion: boolean,
  setReduceMotion: (v: boolean) => void,
  deviceName: string,
  setDeviceName: (v: string) => void,
  navigationMode: 'gestures' | 'buttons',
  setNavigationMode: (m: 'gestures' | 'buttons') => void,
  isDarkMode: boolean,
  setIsDarkMode: (v: boolean) => void,
  installedAppIds: string[],
  apps: AppConfig[],
  onUninstall: (id: AppId) => void,
  onPowerOff: () => void,
  onRestart: () => void
}) => {
  const [activeSection, setActiveSection] = useState<'main' | 'wallpaper' | 'about' | 'safety' | 'accessibility' | 'medical' | 'navigation' | 'apps' | 'power' | 'update'>('main');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PREMADE_WALLPAPERS = [
    'https://picsum.photos/seed/nebula1/1080/1920',
    'https://picsum.photos/seed/nebula2/1080/1920',
    'https://picsum.photos/seed/nebula3/1080/1920',
    'https://picsum.photos/seed/nebula4/1080/1920',
    'https://picsum.photos/seed/nebula5/1080/1920',
    'https://picsum.photos/seed/nebula6/1080/1920',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setWallpaper(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startUpdate = () => {
    setIsUpdating(true);
    setUpdateProgress(0);
    const interval = setInterval(() => {
      setUpdateProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUpdating(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="h-full bg-[var(--bg)] text-[var(--fg)] overflow-hidden flex flex-col transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {activeSection === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold mb-8 font-display">Settings</h1>
              
              <section 
                className="glass rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform"
                onClick={onOpenProfile}
              >
                <div className="p-4 border-b border-white/5 flex items-center gap-4">
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="w-12 h-12 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{profile.username}</h3>
                    <p className="text-xs text-zinc-400">View Profile</p>
                  </div>
                  <ChevronLeft size={16} className="rotate-180 opacity-30" />
                </div>
              </section>

              <section className="glass rounded-2xl p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Palette className="text-zinc-400" size={20} />
                  <span className="font-bold">Appearance</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Theme</label>
                    <div className="grid grid-cols-3 gap-2">
                      {THEMES.map(t => (
                        <button 
                          key={t.id}
                          onClick={() => setTheme(t)}
                          className={`p-3 rounded-xl border-2 transition-all ${theme.id === t.id ? 'border-white/20 bg-white/10' : 'border-transparent bg-white/5'}`}
                        >
                          <div className="text-[10px] font-bold">{t.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Accent Color</label>
                    <div className="grid grid-cols-6 gap-2">
                      {ACCENT_COLORS.map(c => (
                        <button 
                          key={c.id}
                          onClick={() => setAccent(c.hex)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${accent === c.hex ? 'border-white scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveSection('wallpaper')}
                    className="w-full flex items-center justify-between py-2 border-t border-white/5 mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <ImageIcon className="text-zinc-400" size={18} />
                      <span>Wallpaper</span>
                    </div>
                    <ChevronLeft size={16} className="rotate-180 opacity-30" />
                  </button>

                  <div className="w-full flex items-center justify-between py-2 border-t border-white/5 mt-2">
                    <div className="flex items-center gap-3">
                      {isDarkMode ? <Moon className="text-zinc-400" size={18} /> : <Sun className="text-zinc-400" size={18} />}
                      <span>Dark Mode</span>
                    </div>
                    <button 
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? '' : 'bg-zinc-300 dark:bg-zinc-800'}`}
                      style={{ backgroundColor: isDarkMode ? accent : undefined }}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isDarkMode ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </section>

              <section className="glass rounded-2xl p-4 space-y-4">
                {[
                  { icon: Bell, label: 'Notifications', color: 'text-red-400', section: null },
                  { icon: Lock, label: 'Privacy & Security', color: 'text-green-400', section: null },
                  { icon: Shield, label: 'Safety & Emergency', color: 'text-red-500', section: 'safety' },
                  { icon: Accessibility, label: 'Accessibility', color: 'text-purple-400', section: 'accessibility' },
                  { icon: Smartphone, label: 'Navigation', color: 'text-zinc-400', section: 'navigation' },
                  { icon: RefreshCw, label: 'System Update', color: 'text-blue-500', section: 'update' },
                  { icon: Grid3X3, label: 'Apps', color: 'text-orange-400', section: 'apps' },
                  { icon: Power, label: 'Power', color: 'text-red-500', section: 'power' },
                  { icon: Info, label: 'About Phone', color: 'text-blue-400', section: 'about' }
                ].map(item => (
                  <button 
                    key={item.label} 
                    onClick={() => item.section && setActiveSection(item.section as any)}
                    className="w-full flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={item.color} size={20} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronLeft size={16} className="rotate-180 opacity-30" />
                  </button>
                ))}
              </section>
            </motion.div>
          )}

          {activeSection === 'wallpaper' && (
            <motion.div
              key="wallpaper"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setActiveSection('main')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
                <h1 className="text-2xl font-bold font-display">Wallpaper</h1>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[9/16] glass rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/10 hover:border-white/20 transition-all"
                >
                  <Plus size={32} className="text-zinc-500" />
                  <span className="text-xs font-bold text-zinc-500">Upload Custom</span>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="image/*" 
                  />
                </button>
                {PREMADE_WALLPAPERS.map((w, i) => (
                  <button 
                    key={i} 
                    onClick={() => setWallpaper(w)}
                    className={`aspect-[9/16] rounded-2xl overflow-hidden border-2 transition-all ${wallpaper === w ? 'scale-95' : 'border-transparent'}`}
                    style={{ borderColor: wallpaper === w ? accent : 'transparent' }}
                  >
                    <img src={w} alt={`Wallpaper ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'navigation' && (
            <motion.div
              key="navigation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setActiveSection('main')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
                <h1 className="text-2xl font-bold font-display">Navigation</h1>
              </div>
              <div className="glass rounded-2xl p-4 space-y-4">
                <button 
                  onClick={() => setNavigationMode('gestures')}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${navigationMode === 'gestures' ? 'bg-white/10' : 'border-transparent bg-white/5'}`}
                  style={{ borderColor: navigationMode === 'gestures' ? accent : 'transparent' }}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-bold">Gesture Navigation</span>
                    <span className="text-[10px] text-zinc-500">Swipe up for home, swipe down for settings</span>
                  </div>
                  {navigationMode === 'gestures' && <CheckCircle2 size={20} style={{ color: accent }} />}
                </button>
                <button 
                  onClick={() => setNavigationMode('buttons')}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${navigationMode === 'buttons' ? 'bg-white/10' : 'border-transparent bg-white/5'}`}
                  style={{ borderColor: navigationMode === 'buttons' ? accent : 'transparent' }}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-bold">3-Button Navigation</span>
                    <span className="text-[10px] text-zinc-500">Back, Home, and Recents buttons</span>
                  </div>
                  {navigationMode === 'buttons' && <CheckCircle2 size={20} style={{ color: accent }} />}
                </button>
              </div>
            </motion.div>
          )}

          {activeSection === 'apps' && (
            <motion.div
              key="apps"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setActiveSection('main')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
                <h1 className="text-2xl font-bold font-display">Apps</h1>
              </div>
              
              <div className="space-y-4">
                {apps.filter(app => installedAppIds.includes(app.id)).map(app => (
                  <div key={app.id} className="glass p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`${app.color} w-10 h-10 rounded-xl flex items-center justify-center`}>
                        <app.icon size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{app.name}</h3>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Installed</p>
                      </div>
                    </div>
                    {['settings', 'appstore', 'camera', 'profile', 'calculator', 'notes'].includes(app.id) ? (
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">System</span>
                    ) : (
                      <button 
                        onClick={() => onUninstall(app.id as AppId)}
                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'power' && (
            <motion.div
              key="power"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setActiveSection('main')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
                <h1 className="text-2xl font-bold font-display">Power</h1>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={onRestart}
                  className="w-full glass p-6 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <RefreshCw size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold">Restart</h3>
                    <p className="text-xs text-zinc-500">Reboot the system core</p>
                  </div>
                </button>

                <button 
                  onClick={onPowerOff}
                  className="w-full glass p-6 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                    <Power size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold">Power Off</h3>
                    <p className="text-xs text-zinc-500">Shut down all stellar systems</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {activeSection === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setActiveSection('main')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
                <h1 className="text-2xl font-bold font-display">About Phone</h1>
              </div>
              
              <div className="glass rounded-2xl p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-2">
                  <Smartphone size={48} className="text-zinc-400" />
                </div>
                <div className="w-full">
                  <input 
                    type="text" 
                    value={deviceName} 
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="bg-transparent border-none text-center text-xl font-bold w-full outline-none focus:ring-2 rounded-lg transition-all"
                    style={{ color: accent }}
                  />
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Device Name</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-zinc-400">Model</span>
                  <span className="font-medium">Nebula X-1</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-zinc-400">Software Version</span>
                  <span className="font-medium">NebulaOS 2.0.4</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-400">Serial Number</span>
                  <span className="font-mono text-[10px]">NB-992-X-2026</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'update' && (
            <motion.div
              key="update"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setActiveSection('main')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
                <h1 className="text-2xl font-bold font-display">System Update</h1>
              </div>
              
              <div className="glass rounded-2xl p-8 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <RefreshCw size={40} className={isUpdating ? 'animate-spin' : ''} />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">NebulaOS 2.0.4</h2>
                  <p className="text-xs text-zinc-500">Your system is up to date</p>
                </div>

                {isUpdating ? (
                  <div className="w-full space-y-4">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${updateProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Downloading...</span>
                      <span>{updateProgress}%</span>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={startUpdate}
                    className="px-8 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95"
                    style={{ backgroundColor: accent, color: 'white' }}
                  >
                    Check for Updates
                  </button>
                )}
              </div>

              <div className="glass rounded-2xl p-4 space-y-4">
                <div className="flex items-center gap-3 text-zinc-400">
                  <Info size={16} />
                  <p className="text-[10px] leading-relaxed">
                    System updates provide the latest features, security improvements, and bug fixes for your Nebula device. Please ensure you have a stable connection before starting.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'safety' && (
            <motion.div
              key="safety"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setActiveSection('main')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
                <h1 className="text-2xl font-bold font-display">Safety</h1>
              </div>
              <div className="glass rounded-2xl p-4 space-y-4">
                <button 
                  onClick={() => setActiveSection('medical')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="text-red-400" size={20} />
                    <span className="font-bold">Medical ID</span>
                  </div>
                  <ChevronLeft size={16} className="rotate-180 opacity-30" />
                </button>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="text-orange-400" size={20} />
                    <span className="font-bold">Emergency SOS</span>
                  </div>
                  <div className="w-10 h-5 bg-zinc-800 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'accessibility' && (
            <motion.div
              key="accessibility"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setActiveSection('main')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
                <h1 className="text-2xl font-bold font-display">Accessibility</h1>
              </div>
              <div className="glass rounded-2xl p-4 space-y-6">
                <button 
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="text-zinc-400" size={20} />
                    <div className="flex flex-col text-left">
                      <span className="font-bold">Reduce Motion</span>
                      <span className="text-[10px] text-zinc-500">Simplify animations across OS</span>
                    </div>
                  </div>
                  <div 
                    className={`w-10 h-5 rounded-full relative transition-colors ${reduceMotion ? '' : 'bg-zinc-800'}`}
                    style={{ backgroundColor: reduceMotion ? accent : undefined }}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${reduceMotion ? 'right-1' : 'left-1'}`} />
                  </div>
                </button>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Monitor className="text-zinc-400" size={20} />
                    <div className="flex flex-col">
                      <span className="font-bold">High Contrast</span>
                      <span className="text-[10px] text-zinc-500">Increase contrast for UI elements</span>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-zinc-800 rounded-full relative">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CameraApp = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
    setupCamera();
  }, []);

  return (
    <div className="h-full bg-black relative flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
      </div>
      <div className="h-32 bg-black flex items-center justify-around px-8">
        <div className="w-10 h-10 rounded-full bg-zinc-800" />
        <button className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white" />
        </button>
        <div className="w-10 h-10 rounded-full bg-zinc-800" />
      </div>
    </div>
  );
};

// --- Main OS Component ---

export default function App() {
  const [activeApp, setActiveApp] = useState<AppId>('home');
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('nebula_theme');
    return saved ? JSON.parse(saved) : THEMES[0];
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('nebula_accent') || '#9333ea';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('nebula_dark_mode') === 'true';
  });
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('nebula_dark_mode', isDarkMode.toString());
  }, [isDarkMode]);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isPoweredOff, setIsPoweredOff] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isBooting, setIsBooting] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [isDraggingFromDrawer, setIsDraggingFromDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nebula_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('nebula_installed_apps');
    return saved ? JSON.parse(saved) : ['browser', 'weather', 'music', 'appstore', 'camera', 'settings'];
  });
  const [wallpaper, setWallpaper] = useState(() => {
    return localStorage.getItem('nebula_wallpaper') || 'https://picsum.photos/seed/nebulabs-bg/1080/1920';
  });
  const [reduceMotion, setReduceMotion] = useState(() => {
    return localStorage.getItem('nebula_reduce_motion') === 'true';
  });
  const [deviceName, setDeviceName] = useState(() => {
    return localStorage.getItem('nebula_device_name') || 'Nebula Phone 1';
  });
  const [navigationMode, setNavigationMode] = useState<'gestures' | 'buttons'>(() => {
    return (localStorage.getItem('nebula_nav_mode') as 'gestures' | 'buttons') || 'gestures';
  });
  const [history, setHistory] = useState<AppId[]>(['home']);
  const [isRecentsOpen, setIsRecentsOpen] = useState(false);

  const [homeItems, setHomeItems] = useState<HomeItem[]>(() => {
    const saved = localStorage.getItem('nebula_home_items');
    return saved ? JSON.parse(saved) : [
      { type: 'widget', id: 'clock-1' },
      { type: 'app', id: 'browser' },
      { type: 'app', id: 'weather' },
      { type: 'app', id: 'music' },
      { type: 'app', id: 'appstore' }
    ];
  });
  const [folders, setFolders] = useState<FolderConfig[]>(() => {
    const saved = localStorage.getItem('nebula_folders');
    return saved ? JSON.parse(saved) : [];
  });
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem('nebula_widgets');
    return saved ? JSON.parse(saved) : [
      { id: 'clock-1', type: 'clock', size: 'medium' }
    ];
  });

  // Quick Settings States
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [flashlightEnabled, setFlashlightEnabled] = useState(false);
  const [brightness, setBrightness] = useState(80);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    const handleAddWidget = (e: any) => {
      const type = e.detail;
      const id = `${type}-${Date.now()}`;
      setWidgets(prev => [...prev, { id, type, size: 'medium' }]);
      setHomeItems(prev => [{ type: 'widget', id }, ...prev]);
    };
    window.addEventListener('nebula_add_widget', handleAddWidget);

    return () => {
      clearInterval(timer);
      window.removeEventListener('nebula_add_widget', handleAddWidget);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('nebula_theme', JSON.stringify(theme));
    localStorage.setItem('nebula_accent', accentColor);
    localStorage.setItem('nebula_profile', JSON.stringify(profile));
    localStorage.setItem('nebula_installed_apps', JSON.stringify(installedAppIds));
    localStorage.setItem('nebula_wallpaper', wallpaper);
    localStorage.setItem('nebula_reduce_motion', reduceMotion.toString());
    localStorage.setItem('nebula_device_name', deviceName);
    localStorage.setItem('nebula_nav_mode', navigationMode);
    localStorage.setItem('nebula_home_items', JSON.stringify(homeItems));
    localStorage.setItem('nebula_folders', JSON.stringify(folders));
    localStorage.setItem('nebula_widgets', JSON.stringify(widgets));
  }, [theme, accentColor, profile, installedAppIds, wallpaper, reduceMotion, deviceName, navigationMode, homeItems, folders, widgets]);

  const apps: AppConfig[] = useMemo(() => [
    { id: 'browser', name: 'Browser', icon: Globe, color: 'bg-blue-500', component: BrowserApp },
    { id: 'weather', name: 'Weather', icon: Cloud, color: 'bg-sky-400', component: WeatherApp },
    { id: 'quadrais-ai', name: 'Quadrais AI', icon: Sparkles, color: 'bg-purple-600', component: QuadraisAIApp },
    { id: 'computer-hub', name: 'Computer Hub', icon: Cpu, color: 'bg-blue-600', component: ComputerHubApp },
    { id: 'music', name: 'Music', icon: MusicIcon, color: 'bg-purple-600', component: MusicApp },
    { id: 'appstore', name: 'Store', icon: ShoppingBag, color: 'bg-zinc-800', component: () => <AppStoreApp installedAppIds={installedAppIds} onInstall={toggleInstall} accent={accentColor} /> },
    { id: 'camera', name: 'Camera', icon: CameraIcon, color: 'bg-zinc-700', component: CameraApp },
    { id: 'settings', name: 'Settings', icon: SettingsIcon, color: 'bg-zinc-600', component: () => <SettingsApp theme={theme} setTheme={setTheme} accent={accentColor} setAccent={setAccentColor} profile={profile} setProfile={setProfile} onOpenProfile={() => setActiveApp('profile')} wallpaper={wallpaper} setWallpaper={setWallpaper} reduceMotion={reduceMotion} setReduceMotion={setReduceMotion} deviceName={deviceName} setDeviceName={setDeviceName} navigationMode={navigationMode} setNavigationMode={setNavigationMode} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} installedAppIds={installedAppIds} apps={apps} onUninstall={handleUninstall} onPowerOff={handlePowerOff} onRestart={handleRestart} /> },
    { id: 'profile', name: 'Profile', icon: User, color: 'bg-indigo-500', component: () => <ProfileApp profile={profile} setProfile={setProfile} accent={accentColor} /> },
    { id: 'messages', name: 'Messages', icon: MessageSquare, color: 'bg-blue-500', component: MessagesApp },
    { id: 'calendar', name: 'Calendar', icon: CalendarIcon, color: 'bg-green-500', component: CalendarApp },
    { id: 'emails', name: 'Emails', icon: Mail, color: 'bg-indigo-600', component: EmailsApp },
    { id: 'paint', name: 'Paint', icon: PenTool, color: 'bg-orange-500', component: PaintApp },
    { id: 'snake', name: 'Snake', icon: Gamepad2, color: 'bg-green-600', component: SnakeApp },
    { id: 'minesweeper', name: 'Sweeper', icon: Grid3X3, color: 'bg-zinc-700', component: MinesweeperApp },
    { id: 'calculator', name: 'Calculator', icon: Calculator, color: 'bg-orange-600', component: CalculatorApp },
    { id: 'notes', name: 'Notes', icon: FileText, color: 'bg-yellow-600', component: NotesApp },
    { id: 'maps', name: 'Maps', icon: MapPin, color: 'bg-green-600', component: MapsApp },
  ], [theme, accentColor, profile, installedAppIds, wallpaper, reduceMotion, deviceName, navigationMode]);

  const getAppBg = (appId: AppId, defaultColor: string) => {
    const systemApps: AppId[] = ['settings', 'appstore', 'camera', 'profile', 'calculator', 'notes'];
    if (systemApps.includes(appId)) return { backgroundColor: accentColor };
    return {};
  };

  const toggleInstall = (id: AppId) => {
    if (installedAppIds.includes(id)) {
      handleOpenApp(id);
    } else {
      setInstalledAppIds([...installedAppIds, id]);
    }
  };

  const togglePin = (id: AppId) => {
    if (homeItems.some(item => item.type === 'app' && item.id === id)) {
      setHomeItems(homeItems.filter(item => !(item.type === 'app' && item.id === id)));
    } else {
      setHomeItems([...homeItems, { type: 'app', id }]);
    }
  };

  const removeWidget = (id: string) => {
    setHomeItems(homeItems.filter(item => !(item.type === 'widget' && item.id === id)));
  };

  const handleDragEnd = (draggedItem: HomeItem, info: any) => {
    const { x, y } = info.point;
    
    // Check for folder merging
    const targetItem = homeItems.find(item => {
      if (item.id === draggedItem.id) return false;
      const el = document.getElementById(`home-item-${item.id}`);
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
    });

    if (targetItem) {
      if (targetItem.type === 'folder') {
        // Add to existing folder
        if (draggedItem.type === 'app') {
          setFolders(prev => prev.map(f => 
            f.id === targetItem.id ? { ...f, appIds: [...f.appIds, draggedItem.id as AppId] } : f
          ));
          setHomeItems(prev => prev.filter(item => item.id !== draggedItem.id));
        }
      } else if (targetItem.type === 'app' && draggedItem.type === 'app') {
        // Create new folder
        const folderId = `folder-${Date.now()}`;
        const folderName = prompt('Folder Name?', 'New Folder') || 'New Folder';
        setFolders(prev => [...prev, { 
          id: folderId, 
          name: folderName, 
          appIds: [targetItem.id as AppId, draggedItem.id as AppId] 
        }]);
        setHomeItems(prev => prev.filter(item => item.id !== targetItem.id && item.id !== draggedItem.id));
        setHomeItems(prev => [{ type: 'folder', id: folderId }, ...prev]);
      }
    }
  };

  const handleUninstall = (id: AppId) => {
    if (['settings', 'appstore', 'camera', 'profile', 'calculator', 'notes'].includes(id)) return;
    
    setInstalledAppIds(prev => prev.filter(appId => appId !== id));
    setHomeItems(prev => prev.filter(item => !(item.type === 'app' && item.id === id)));
    // Also remove from folders
    setFolders(prev => prev.map(f => ({
      ...f,
      appIds: f.appIds.filter(appId => appId !== id)
    })));
    
    if (activeApp === id) {
      setActiveApp('home');
    }
  };

  const handleOpenApp = (id: AppId) => {
    setActiveApp(id);
    setHistory(prev => [...prev, id]);
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousApp = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setActiveApp(previousApp);
    } else {
      setActiveApp('home');
    }
  };

  const handleHomeGesture = () => {
    setActiveApp('home');
    setHistory(['home']);
  };

  const handleRestart = () => {
    setIsControlCenterOpen(false);
    setIsRestarting(true);
    setTimeout(() => {
      setIsRestarting(false);
      setIsBooting(true);
      setTimeout(() => {
        setIsBooting(false);
        setActiveApp('home');
      }, 3000);
    }, 1000);
  };

  const handlePowerOff = () => {
    setIsControlCenterOpen(false);
    setIsPoweredOff(true);
  };

  const handlePowerOn = () => {
    setIsBooting(true);
    setTimeout(() => {
      setIsBooting(false);
      setIsPoweredOff(false);
      setActiveApp('home');
    }, 3000);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${theme.bg} transition-colors duration-700 ${isDarkMode ? 'dark' : ''}`}>
      {/* Wallpaper */}
      <div className="absolute inset-0 z-0">
        <img src={wallpaper} alt="Wallpaper" className="w-full h-full object-cover opacity-100 transition-all duration-1000" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Background Nebula Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] blur-[120px] rounded-full animate-pulse" style={{ backgroundColor: `${accentColor}20` }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] blur-[120px] rounded-full animate-pulse" style={{ backgroundColor: `${accentColor}10`, animationDelay: '2s' }} />
      </div>

      {/* Power Off Screen */}
      <AnimatePresence>
        {isPoweredOff && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center gap-8"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePowerOn}
              className="w-20 h-20 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-colors"
            >
              <Zap size={32} />
            </motion.button>
            <p className="text-zinc-700 text-xs uppercase tracking-[0.2em] font-bold">Hold to Power On</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boot/Restart Screen */}
      <AnimatePresence>
        {(isRestarting || isBooting) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)]">
                <Smartphone size={48} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold font-display text-white tracking-widest">NEBULA OS</h1>
            </motion.div>
            <div className="absolute bottom-20 flex flex-col items-center gap-2">
              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent"
                />
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">System Loading</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OS Container - Full Screen with Square Edges */}
      <div className={`relative w-full h-full bg-[var(--bg)] overflow-hidden flex flex-col transition-all duration-700 ${isPoweredOff ? 'brightness-0' : ''}`}>
        
        {/* Status Bar / Swipe Down Trigger */}
        {/* Status Bar / Gesture Area */}
        <motion.div 
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 50) {
              const midPoint = window.innerWidth / 2;
              if (info.point.x < midPoint) {
                setIsNotificationCenterOpen(true);
              } else {
                setIsControlCenterOpen(true);
              }
            }
          }}
          className="h-12 px-8 flex items-center justify-between z-50 text-[var(--fg)] text-xs font-medium cursor-ns-resize"
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
              <rect x="4" y="8" width="24" height="6" rx="2" fill="#E5E7EB" stroke="#4B5563" strokeWidth="1" />
              <rect x="4" y="18" width="24" height="6" rx="2" fill="#E5E7EB" stroke="#4B5563" strokeWidth="1" />
            </svg>
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2">
            {wifiEnabled && <Wifi size={14} />}
            {bluetoothEnabled && <Bluetooth size={14} />}
            <Signal size={14} />
            <Battery size={14} />
          </div>
        </motion.div>

        {/* Screen Content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeApp === 'home' ? (
              <motion.div 
                key="home"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.1 }}
                transition={reduceMotion ? { duration: 0.2 } : {}}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y < -50) setIsAppDrawerOpen(true);
                }}
                className="h-full w-full p-8 flex flex-col"
              >
                {/* Search Bar */}
                <div 
                  className="glass rounded-2xl p-3 mb-8 flex items-center gap-3 text-white/50 transition-all"
                  style={{ border: `1px solid ${accentColor}30` }}
                >
                  <Search size={18} style={{ color: accentColor }} />
                  <span className="text-sm">Search apps...</span>
                </div>

                {/* App Grid - Dynamic Home Items */}
                <Reorder.Group 
                  axis="y" 
                  values={homeItems} 
                  onReorder={setHomeItems}
                  className="grid grid-cols-4 gap-y-8 gap-x-4 overflow-y-auto pb-8"
                >
                  {homeItems.map((item, index) => {
                    const isWidget = item.type === 'widget';
                    const isFolder = item.type === 'folder';
                    const isApp = item.type === 'app';

                    return (
                      <Reorder.Item 
                        key={item.id || (item as any).id || (item as any).type + (item as any).id}
                        value={item}
                        id={`home-item-${item.id}`}
                        onDragEnd={(_, info) => handleDragEnd(item, info)}
                        className={`${isWidget ? 'col-span-2 row-span-1' : 'col-span-1'} cursor-grab active:cursor-grabbing`}
                        whileDrag={{ 
                          scale: 1.05, 
                          zIndex: 50,
                          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                        }}
                        layout
                      >
                        {isApp && (() => {
                          const app = apps.find(a => a.id === item.id);
                          if (!app) return null;
                          return (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleOpenApp(app.id)}
                              className="flex flex-col items-center gap-2 w-full"
                            >
                              <div 
                                className={`${app.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all`}
                                style={getAppBg(app.id, app.color)}
                              >
                                <app.icon className="text-white" size={28} />
                              </div>
                              <span className="text-[10px] text-white font-medium truncate w-full text-center">{app.name}</span>
                            </motion.button>
                          );
                        })()}
                        {isWidget && (() => {
                          const widget = widgets.find(w => w.id === item.id);
                          if (!widget) return null;
                          return (
                            <div className="relative group w-full h-full">
                              <WidgetComponent widget={widget} accent={accentColor} />
                              <button 
                                onClick={() => removeWidget(widget.id)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              >
                                <Trash2 size={12} className="text-red-400" />
                              </button>
                            </div>
                          );
                        })()}
                        {isFolder && (() => {
                          const folder = folders.find(f => f.id === item.id);
                          if (!folder) return null;
                          return <FolderComponent folder={folder} apps={apps} onOpenApp={handleOpenApp} accent={accentColor} />;
                        })()}
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>

                {/* Pull Up Indicator for App Drawer */}
                <div className="mt-auto mb-4 flex flex-col items-center gap-2 cursor-pointer" onClick={() => setIsAppDrawerOpen(true)}>
                  <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-white/30"
                  >
                    <Smartphone size={16} className="rotate-180" />
                  </motion.div>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Swipe up for apps</span>
                </div>

                {/* Dock */}
                <div 
                  className="glass rounded-[32px] p-4 flex justify-around items-center"
                  style={{ border: `1px solid ${accentColor}20` }}
                >
                  {apps.filter(a => installedAppIds.includes(a.id)).slice(0, 4).map(app => (
                    <button 
                      key={`dock-${app.id}`} 
                      onClick={() => handleOpenApp(app.id)}
                      className={`${app.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all`}
                      style={getAppBg(app.id, app.color)}
                    >
                      <app.icon className="text-white" size={24} />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeApp}
                initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
                animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
                transition={reduceMotion ? { duration: 0.2 } : { type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-40"
              >
                {(() => {
                  const app = apps.find(a => a.id === activeApp);
                  if (!app) return null;
                  const Component = app.component;
                  return <Component />;
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* App Drawer Overlay */}
          <AnimatePresence>
            {isAppDrawerOpen && (
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
                animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
                transition={reduceMotion ? { duration: 0.2 } : { type: 'spring', damping: 30, stiffness: 200 }}
                drag="y"
                dragConstraints={{ top: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 100) setIsAppDrawerOpen(false);
                }}
                className="absolute inset-0 z-[100] bg-[var(--bg)]/90 backdrop-blur-xl p-8 pt-16 flex flex-col transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold font-display text-[var(--fg)]">N Launcher</h2>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const name = prompt('Folder Name?', 'New Folder');
                        if (name) {
                          const id = `folder-${Date.now()}`;
                          setFolders(prev => [...prev, { id, name, appIds: [] }]);
                          setHomeItems(prev => [{ type: 'folder', id }, ...prev]);
                        }
                      }}
                      className="p-2 bg-white/10 rounded-full text-white flex items-center gap-2 px-3"
                    >
                      <Folder size={16} />
                      <span className="text-[10px] font-bold">NEW FOLDER</span>
                    </button>
                    <button onClick={() => setIsAppDrawerOpen(false)} className="p-2 bg-white/10 rounded-full text-white">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Search in Drawer */}
                <div 
                  className="glass rounded-2xl p-3 mb-8 flex items-center gap-3 text-white/50"
                  style={{ border: `1px solid ${accentColor}30` }}
                >
                  <Search size={18} style={{ color: accentColor }} />
                  <input 
                    type="text" 
                    placeholder="Search apps..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full text-white"
                  />
                </div>

                <div className="grid grid-cols-4 gap-y-8 gap-x-4 overflow-y-auto pb-20 relative">
                  <AnimatePresence>
                    {isDraggingFromDrawer && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-24 left-8 right-8 h-20 glass rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center gap-3 z-[110]"
                        style={{ borderColor: accentColor }}
                      >
                        <FolderPlus className="text-white" size={24} />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">Drop to add to folder</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {apps.filter(app => 
                    app.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                    installedAppIds.includes(app.id)
                  ).map(app => (
                    <motion.div
                      key={`drawer-${app.id}`}
                      className="flex flex-col items-center gap-2 relative group"
                      drag
                      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                      dragElastic={1}
                      onDragStart={() => setIsDraggingFromDrawer(true)}
                      onDragEnd={(_, info) => {
                        setIsDraggingFromDrawer(false);
                        // If dragged up significantly, pin to home
                        if (info.offset.y < -150) {
                          if (!homeItems.some(item => item.type === 'app' && item.id === app.id)) {
                            setHomeItems(prev => [{ type: 'app', id: app.id }, ...prev]);
                            setIsAppDrawerOpen(false);
                          }
                        }
                        // If dragged down to the folder zone
                        else if (info.offset.y > 150) {
                          if (folders.length === 0) {
                            alert('Create a folder first!');
                            return;
                          }
                          const folderName = prompt(`Add to which folder?\nAvailable: ${folders.map(f => f.name).join(', ')}`);
                          const folder = folders.find(f => f.name === folderName);
                          if (folder) {
                            setFolders(prev => prev.map(f => f.id === folder.id ? { ...f, appIds: [...new Set([...f.appIds, app.id])] } : f));
                          }
                        }
                      }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          handleOpenApp(app.id);
                          setIsAppDrawerOpen(false);
                        }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div 
                          className={`${app.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all`}
                          style={getAppBg(app.id, app.color)}
                        >
                          <app.icon className="text-white" size={28} />
                        </div>
                        <span className="text-[10px] text-white font-medium">{app.name}</span>
                      </motion.button>
                      
                      <button 
                        onClick={() => {
                          if (folders.length === 0) {
                            alert('Create a folder first!');
                            return;
                          }
                          const folderName = prompt(`Add to which folder?\nAvailable: ${folders.map(f => f.name).join(', ')}`);
                          const folder = folders.find(f => f.name === folderName);
                          if (folder) {
                            setFolders(prev => prev.map(f => f.id === folder.id ? { ...f, appIds: [...new Set([...f.appIds, app.id])] } : f));
                          }
                        }}
                        className="absolute -top-1 -left-1 w-6 h-6 bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <FolderPlus size={12} className="text-blue-400" />
                      </button>

                      <button 
                        onClick={() => togglePin(app.id)}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {homeItems.some(item => item.type === 'app' && item.id === app.id) ? (
                          <Trash2 size={12} className="text-red-400" />
                        ) : (
                          <Plus size={12} className="text-green-400" />
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Swipe Down to Close Indicator */}
                <div 
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full cursor-pointer"
                  onClick={() => setIsAppDrawerOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Settings / Control Center Overlay */}
          <NotificationCenter 
            isOpen={isNotificationCenterOpen} 
            onClose={() => setIsNotificationCenterOpen(false)} 
            accent={accentColor}
            time={time}
          />

          <AnimatePresence>
            {isControlCenterOpen && (
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { y: '-100%' }}
                animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { y: '-100%' }}
                transition={reduceMotion ? { duration: 0.2 } : { type: 'spring', damping: 25, stiffness: 150 }}
                className="absolute inset-0 z-[100] glass p-8 pt-16 flex flex-col gap-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold font-display text-[var(--fg)]">Quick Settings</h2>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const confirmPower = window.confirm("Power Options:\nOK to Restart, Cancel to Power Off");
                        if (confirmPower) handleRestart();
                        else handlePowerOff();
                      }}
                      className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 transition-colors"
                    >
                      <Zap size={20} />
                    </button>
                    <button onClick={() => setIsControlCenterOpen(false)} className="p-2 bg-white/10 rounded-full">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Toggles */}
                  <div className="glass rounded-3xl p-4 grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setWifiEnabled(!wifiEnabled)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${wifiEnabled ? 'text-white' : 'bg-white/10 text-white/30'}`}
                      style={{ backgroundColor: wifiEnabled ? accentColor : undefined }}
                    >
                      <Wifi size={20} />
                    </button>
                    <button 
                      onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${bluetoothEnabled ? 'text-white' : 'bg-white/10 text-white/30'}`}
                      style={{ backgroundColor: bluetoothEnabled ? accentColor : undefined }}
                    >
                      <Bluetooth size={20} />
                    </button>
                    <button 
                      onClick={() => setFlashlightEnabled(!flashlightEnabled)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${flashlightEnabled ? 'bg-yellow-500 text-white' : 'bg-white/10 text-white/30'}`}
                    >
                      <Flashlight size={20} />
                    </button>
                    <button 
                      className="w-12 h-12 rounded-full bg-white/10 text-white/30 flex items-center justify-center"
                    >
                      <Signal size={20} />
                    </button>
                  </div>

                  {/* Sliders */}
                  <div className="glass rounded-3xl p-4 flex flex-col gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500">
                        <Sun size={12} />
                        <span>Brightness</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value))}
                        className="w-full"
                        style={{ accentColor: accentColor }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-zinc-500">
                        <Volume2 size={12} />
                        <span>Volume</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        defaultValue="60"
                        className="w-full"
                        style={{ accentColor: accentColor }}
                      />
                    </div>
                  </div>
                </div>

                {/* Media Player Mini */}
                <div className="glass rounded-3xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <MusicIcon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold">Stellar Drift</div>
                    <div className="text-[10px] opacity-50">Nebula Collective</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <SkipBack size={16} />
                    <Play size={20} fill="currentColor" />
                    <SkipForward size={16} />
                  </div>
                </div>
                
                <div className="flex-1" onClick={() => setIsControlCenterOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Bar */}
        <div className="h-16 relative bg-[var(--glass-bg)] backdrop-blur-md border-t border-[var(--glass-border)] overflow-hidden transition-colors duration-300">
          {navigationMode === 'gestures' ? (
            <motion.div 
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const { x, y } = info.offset;
                // Home gesture: Swipe up
                if (y < -60 && Math.abs(x) < 80) {
                  handleHomeGesture();
                } 
                // Back gesture: Swipe right from left side
                else if (x > 100 && Math.abs(y) < 80) {
                  handleBack();
                } 
                // Recents gesture: Swipe left from right side
                else if (x < -100 && Math.abs(y) < 80) {
                  setIsRecentsOpen(true);
                }
              }}
              className="w-full h-full flex items-center justify-center cursor-pointer group z-50"
            >
              <motion.div 
                className="w-32 h-1.5 rounded-full transition-all duration-300"
                style={{ backgroundColor: `${accentColor}50` }}
                whileHover={{ 
                  backgroundColor: accentColor,
                  width: 180,
                  height: 8
                }}
                whileTap={{
                  scale: 0.9,
                  backgroundColor: accentColor
                }}
              />
            </motion.div>
          ) : (
            <div className="flex items-center justify-around w-full h-full px-8">
              <button onClick={handleBack} className="p-2 text-white/50 hover:text-white transition-colors">
                <ChevronLeft size={24} />
              </button>
              <button onClick={handleHomeGesture} className="p-2 text-white/50 hover:text-white transition-colors">
                <div className="w-4 h-4 rounded-full border-2 border-current" />
              </button>
              <button onClick={() => setIsRecentsOpen(true)} className="p-2 text-white/50 hover:text-white transition-colors">
                <div className="w-4 h-4 rounded-sm border-2 border-current" />
              </button>
            </div>
          )}
        </div>

        {/* Recents Overlay */}
        <AnimatePresence>
          {isRecentsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[200] bg-[var(--bg)]/80 backdrop-blur-xl p-8 flex flex-col transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-display text-[var(--fg)]">Recents</h2>
                <button onClick={() => setIsRecentsOpen(false)} className="p-2 bg-white/10 rounded-full text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-x-auto flex items-center gap-6 px-4">
                {history.filter(id => id !== 'home').reverse().map((id, i) => {
                  const app = apps.find(a => a.id === id);
                  if (!app) return null;
                  return (
                    <motion.div
                      key={`recent-${id}-${i}`}
                      whileHover={{ scale: 1.05 }}
                      className="min-w-[200px] h-[350px] glass rounded-3xl overflow-hidden flex flex-col shadow-2xl cursor-pointer"
                      onClick={() => {
                        setActiveApp(id);
                        setIsRecentsOpen(false);
                      }}
                    >
                      <div className="p-4 border-b border-white/10 flex items-center gap-3">
                        <div className={`${app.color} w-8 h-8 rounded-lg flex items-center justify-center`}>
                          <app.icon size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-sm text-white">{app.name}</span>
                      </div>
                      <div className="flex-1 bg-zinc-900/50 flex items-center justify-center">
                        <app.icon size={64} className="text-white/10" />
                      </div>
                    </motion.div>
                  );
                })}
                {history.length <= 1 && (
                  <div className="w-full text-center text-white/30">No recent apps</div>
                )}
              </div>
              <button 
                onClick={() => {
                  setHistory(['home']);
                  setActiveApp('home');
                  setIsRecentsOpen(false);
                }}
                className="mt-8 self-center px-8 py-3 glass rounded-full text-white font-bold"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions for the user */}
      <div className="fixed bottom-8 left-8 max-w-xs text-xs text-white/30 font-mono space-y-2 hidden lg:block">
        <p>N LAUNCHER v1.2.0</p>
        <p>• Swipe up on bottom bar for Home</p>
        <p>• Swipe down from status bar for Quick Settings</p>
        <p>• PWA Installable enabled</p>
      </div>
    </div>
  );
}
