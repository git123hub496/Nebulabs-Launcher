/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { AppId, AppConfig, Theme, THEMES, UserProfile, DEFAULT_PROFILE } from './types';
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
  Flashlight
} from 'lucide-react';

// --- Mock Apps ---

const ProfileApp = ({ profile, setProfile }: { profile: UserProfile, setProfile: (p: UserProfile) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  return (
    <div className="h-full bg-zinc-950 text-white p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-display">Profile</h1>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="bg-purple-600 px-4 py-1 rounded-full text-sm font-bold"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <img 
            src={isEditing ? tempProfile.avatar : profile.avatar} 
            alt="Avatar" 
            className="w-32 h-32 rounded-full border-4 border-purple-500/30 object-cover mb-4"
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
        <span>nebulabs.com</span>
      </div>
    </div>
    <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
      <Globe size={64} className="text-blue-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Welcome to the Future</h2>
      <p className="text-zinc-500">The Nebulabs browser is lightning fast and privacy-focused.</p>
    </div>
  </div>
);

const WeatherApp = () => (
  <div className="h-full bg-gradient-to-b from-blue-400 to-blue-600 p-8 text-white">
    <div className="text-center mt-12">
      <h2 className="text-3xl font-light">Nebula City</h2>
      <div className="text-8xl font-thin my-4">24°</div>
      <p className="text-xl">Mostly Clear</p>
    </div>
    <div className="mt-12 grid grid-cols-4 gap-4">
      {['Mon', 'Tue', 'Wed', 'Thu'].map(day => (
        <div key={day} className="text-center">
          <p className="text-sm opacity-70">{day}</p>
          <Cloud className="mx-auto my-2" size={24} />
          <p className="font-bold">22°</p>
        </div>
      ))}
    </div>
  </div>
);

const MusicApp = () => (
  <div className="h-full bg-zinc-900 p-8 flex flex-col">
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

const AppStoreApp = () => (
  <div className="h-full bg-black text-white p-6 overflow-y-auto">
    <h1 className="text-4xl font-bold mb-8 font-display">Nebula Store</h1>
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-400">Featured Apps</h2>
        <div className="grid grid-cols-1 gap-4">
          {[
            { name: 'Quantum Chat', desc: 'Secure messaging for the stars', icon: MessageSquare, color: 'bg-blue-500' },
            { name: 'Star Map', desc: 'Navigate the galaxy', icon: Globe, color: 'bg-green-500' },
            { name: 'Nebula Pay', desc: 'Digital currency simplified', icon: Smartphone, color: 'bg-purple-500' }
          ].map(app => (
            <div key={app.name} className="glass p-4 rounded-2xl flex items-center gap-4">
              <div className={`${app.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <app.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{app.name}</h3>
                <p className="text-xs text-zinc-400">{app.desc}</p>
              </div>
              <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full">GET</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

const SettingsApp = ({ theme, setTheme, profile, setProfile, onOpenProfile }: { 
  theme: Theme, 
  setTheme: (t: Theme) => void,
  profile: UserProfile,
  setProfile: (p: UserProfile) => void,
  onOpenProfile: () => void
}) => (
  <div className="h-full bg-zinc-950 text-white p-6 overflow-y-auto">
    <h1 className="text-3xl font-bold mb-8 font-display">Settings</h1>
    
    <div className="space-y-6">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="text-purple-400" size={20} />
            <span>Appearance</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
          {THEMES.map(t => (
            <button 
              key={t.id}
              onClick={() => setTheme(t)}
              className={`p-3 rounded-xl border-2 transition-all ${theme.id === t.id ? 'border-purple-500 bg-purple-500/10' : 'border-transparent bg-white/5'}`}
            >
              <div className="text-[10px] font-bold">{t.name}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="glass rounded-2xl p-4 space-y-4">
        {[
          { icon: Bell, label: 'Notifications', color: 'text-red-400' },
          { icon: Lock, label: 'Privacy & Security', color: 'text-green-400' },
          { icon: Info, label: 'About Phone', color: 'text-blue-400' }
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <item.icon className={item.color} size={20} />
              <span>{item.label}</span>
            </div>
            <ChevronLeft size={16} className="rotate-180 opacity-30" />
          </div>
        ))}
      </section>
    </div>
  </div>
);

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
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [time, setTime] = useState(new Date());
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Quick Settings States
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [flashlightEnabled, setFlashlightEnabled] = useState(false);
  const [brightness, setBrightness] = useState(80);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const apps: AppConfig[] = [
    { id: 'browser', name: 'Browser', icon: Globe, color: 'bg-blue-500', component: BrowserApp },
    { id: 'weather', name: 'Weather', icon: Cloud, color: 'bg-sky-400', component: WeatherApp },
    { id: 'music', name: 'Music', icon: MusicIcon, color: 'bg-purple-600', component: MusicApp },
    { id: 'appstore', name: 'Store', icon: ShoppingBag, color: 'bg-zinc-800', component: AppStoreApp },
    { id: 'camera', name: 'Camera', icon: CameraIcon, color: 'bg-zinc-700', component: CameraApp },
    { id: 'settings', name: 'Settings', icon: SettingsIcon, color: 'bg-zinc-600', component: () => <SettingsApp theme={theme} setTheme={setTheme} profile={profile} setProfile={setProfile} onOpenProfile={() => setActiveApp('profile')} /> },
    { id: 'profile', name: 'Profile', icon: User, color: 'bg-indigo-500', component: () => <ProfileApp profile={profile} setProfile={setProfile} /> },
  ];

  const handleHomeGesture = () => {
    setActiveApp('home');
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${theme.bg} transition-colors duration-700`}>
      {/* Background Nebula Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* OS Container - Full Screen with Square Edges */}
      <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
        
        {/* Status Bar / Swipe Down Trigger */}
        <div 
          className="h-12 px-8 flex items-center justify-between z-50 text-white text-xs font-medium cursor-ns-resize"
          onMouseDown={() => setIsControlCenterOpen(true)}
          onTouchStart={() => setIsControlCenterOpen(true)}
        >
          <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="flex items-center gap-2">
            {wifiEnabled && <Wifi size={14} />}
            {bluetoothEnabled && <Bluetooth size={14} />}
            <Signal size={14} />
            <Battery size={14} className="rotate-90" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeApp === 'home' ? (
              <motion.div 
                key="home"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="h-full w-full p-8 flex flex-col"
              >
                {/* Search Bar */}
                <div className="glass rounded-2xl p-3 mb-8 flex items-center gap-3 text-white/50">
                  <Search size={18} />
                  <span className="text-sm">Search apps...</span>
                </div>

                {/* App Grid */}
                <div className="grid grid-cols-4 gap-6">
                  {apps.filter(a => a.id !== 'profile').map(app => (
                    <motion.button
                      key={app.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveApp(app.id)}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className={`${app.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg`}>
                        <app.icon className="text-white" size={28} />
                      </div>
                      <span className="text-[10px] text-white font-medium">{app.name}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Dock */}
                <div className="mt-auto glass rounded-[32px] p-4 flex justify-around items-center">
                  {apps.slice(0, 4).map(app => (
                    <button 
                      key={`dock-${app.id}`} 
                      onClick={() => setActiveApp(app.id)}
                      className={`${app.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-md`}
                    >
                      <app.icon className="text-white" size={24} />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeApp}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-40"
              >
                {apps.find(a => a.id === activeApp)?.component({})}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Settings / Control Center Overlay */}
          <AnimatePresence>
            {isControlCenterOpen && (
              <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 150 }}
                className="absolute inset-0 z-[100] glass p-8 pt-16 flex flex-col gap-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold font-display text-white">Quick Settings</h2>
                  <button onClick={() => setIsControlCenterOpen(false)} className="p-2 bg-white/10 rounded-full">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Toggles */}
                  <div className="glass rounded-3xl p-4 grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setWifiEnabled(!wifiEnabled)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${wifiEnabled ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/30'}`}
                    >
                      <Wifi size={20} />
                    </button>
                    <button 
                      onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${bluetoothEnabled ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/30'}`}
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
                        className="w-full accent-purple-500"
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
                        className="w-full accent-blue-500"
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

        {/* Home Indicator / Gesture Bar */}
        <div className="h-8 flex items-center justify-center relative">
          <motion.div 
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y < -50) handleHomeGesture();
            }}
            className="w-32 h-1.5 bg-white/30 rounded-full cursor-pointer hover:bg-white/50 transition-colors"
          />
          
          {/* Top Gesture Area for Control Center */}
          <div 
            className="absolute top-[-750px] left-0 right-0 h-12 z-[110] cursor-ns-resize"
            onMouseEnter={() => setIsControlCenterOpen(true)}
          />
        </div>
      </div>

      {/* Instructions for the user */}
      <div className="fixed bottom-8 left-8 max-w-xs text-xs text-white/30 font-mono space-y-2 hidden lg:block">
        <p>NEBULABS OS v1.1.0</p>
        <p>• Swipe up on bottom bar for Home</p>
        <p>• Swipe down from status bar for Quick Settings</p>
        <p>• PWA Installable enabled</p>
      </div>
    </div>
  );
}
