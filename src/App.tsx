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
  Type,
  Calculator,
  FileText,
  Trash2,
  Plus
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

const MessagesApp = () => (
  <div className="h-full bg-zinc-950 text-white flex flex-col">
    <div className="p-6 border-b border-white/5">
      <h1 className="text-2xl font-bold font-display">Messages</h1>
    </div>
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      {[
        { from: 'Nova', text: 'Did you see the meteor shower?', time: '10:24 AM' },
        { from: 'Cosmo', text: 'The new Nebula OS is fire!', time: 'Yesterday' },
        { from: 'Stellar', text: 'Meeting at the space dock at 5.', time: 'Monday' }
      ].map((msg, i) => (
        <div key={i} className="glass p-4 rounded-2xl">
          <div className="flex justify-between mb-1">
            <span className="font-bold text-purple-400">{msg.from}</span>
            <span className="text-[10px] text-zinc-500">{msg.time}</span>
          </div>
          <p className="text-sm">{msg.text}</p>
        </div>
      ))}
    </div>
  </div>
);

const CalendarApp = () => (
  <div className="h-full bg-zinc-950 text-white p-6">
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
  <div className="h-full bg-zinc-950 text-white flex flex-col">
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
    <div className="h-full bg-zinc-900 flex flex-col">
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
    <div className="h-full bg-black text-white p-6 flex flex-col">
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
    <div className="h-full bg-zinc-950 text-white flex flex-col">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
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
    <div className="h-full bg-zinc-950 flex flex-col items-center justify-center p-8">
      <div className="mb-4 flex justify-between w-full text-white font-bold">
        <span>Score: {score}</span>
        {gameOver && <span className="text-red-500">GAME OVER</span>}
      </div>
      <div className="grid grid-cols-20 grid-rows-20 w-full aspect-square bg-zinc-900 border border-white/10 relative">
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
    <div className="h-full bg-zinc-950 flex flex-col items-center justify-center p-6">
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

const AppStoreApp = ({ installedAppIds, onInstall }: { 
  installedAppIds: string[], 
  onInstall: (id: AppId) => void 
}) => {
  const storeApps = [
    { id: 'messages', name: 'Quantum Chat', desc: 'Secure messaging for the stars', icon: MessageSquare, color: 'bg-blue-500' },
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
  ];

  return (
    <div className="h-full bg-black text-white p-6 overflow-y-auto">
      <h1 className="text-4xl font-bold mb-8 font-display">Nebula Store</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-zinc-400">Featured Apps</h2>
          <div className="grid grid-cols-1 gap-4">
            {storeApps.map(app => {
              const isInstalled = installedAppIds.includes(app.id);
              return (
                <div key={app.id} className="glass p-4 rounded-2xl flex items-center gap-4">
                  <div className={`${app.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <app.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{app.name}</h3>
                    <p className="text-xs text-zinc-400">{app.desc}</p>
                  </div>
                  <button 
                    onClick={() => onInstall(app.id as AppId)}
                    className={`text-xs font-bold px-4 py-2 rounded-full transition-colors ${
                      isInstalled 
                        ? 'bg-zinc-800 text-zinc-400' 
                        : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    {isInstalled ? 'OPEN' : 'GET'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
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
  setDeviceName
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
  setDeviceName: (v: string) => void
}) => {
  const [activeSection, setActiveSection] = useState<'main' | 'wallpaper' | 'about' | 'safety' | 'accessibility' | 'medical'>('main');
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

  if (activeSection === 'wallpaper') {
    return (
      <div className="h-full bg-zinc-950 text-white p-6 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection('main')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
          <h1 className="text-2xl font-bold font-display">Wallpaper</h1>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {PREMADE_WALLPAPERS.map((wp, i) => (
            <button 
              key={i} 
              onClick={() => setWallpaper(wp)}
              className={`aspect-[9/16] rounded-2xl overflow-hidden border-2 transition-all ${wallpaper === wp ? 'border-purple-500 scale-95' : 'border-transparent'}`}
            >
              <img src={wp} alt={`Wallpaper ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full glass p-4 rounded-2xl flex items-center justify-center gap-3 font-bold"
        >
          <ImageIcon size={20} />
          Upload Custom Wallpaper
        </button>
      </div>
    );
  }

  if (activeSection === 'about') {
    return (
      <div className="h-full bg-zinc-950 text-white p-6 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection('main')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
          <h1 className="text-2xl font-bold font-display">About Phone</h1>
        </div>
        <div className="space-y-4">
          <div className="glass p-6 rounded-3xl flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center mb-4 shadow-xl">
              <Smartphone size={40} />
            </div>
            <input 
              type="text" 
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="text-xl font-bold bg-transparent border-none outline-none text-center w-full focus:text-purple-400"
            />
            <p className="text-zinc-500 text-sm">Model: NP-2026-X</p>
          </div>
          
          <div className="glass p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold">Software Update</span>
              {isUpdating ? (
                <span className="text-xs text-purple-400 font-bold">{updateProgress}%</span>
              ) : (
                <button onClick={startUpdate} className="text-xs text-purple-400 font-bold">CHECK</button>
              )}
            </div>
            {isUpdating && (
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${updateProgress}%` }} />
              </div>
            )}
            {!isUpdating && updateProgress === 100 && (
              <p className="text-[10px] text-green-500 font-bold">System is up to date</p>
            )}
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            {[
              { label: 'OS Version', value: 'Nebulabs OS 1.1.0' },
              { label: 'Processor', value: 'Stellar X1' },
              { label: 'RAM', value: '12GB' },
              { label: 'Storage', value: '256GB' },
              { label: 'Serial Number', value: 'SN-9928-X-001' }
            ].map(item => (
              <div key={item.label} className="p-4 border-b border-white/5 flex justify-between items-center">
                <span className="text-zinc-400 text-sm">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'safety') {
    return (
      <div className="h-full bg-zinc-950 text-white p-6 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection('main')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
          <h1 className="text-2xl font-bold font-display">Safety & Emergency</h1>
        </div>
        <div className="space-y-6">
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-4">
            <AlertTriangle className="text-red-500 shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-red-500">Emergency SOS</h3>
              <p className="text-xs text-zinc-400">Press the power button 5 times to call emergency services.</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-4 space-y-4">
            <button 
              onClick={() => setActiveSection('medical')}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <User className="text-blue-400" size={20} />
                <span>Medical ID</span>
              </div>
              <ChevronLeft size={16} className="rotate-180 opacity-30" />
            </button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-orange-400" size={20} />
                <span>Earthquake Alerts</span>
              </div>
              <div className="w-10 h-5 bg-purple-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'medical') {
    return (
      <div className="h-full bg-zinc-950 text-white p-6 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection('safety')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
          <h1 className="text-2xl font-bold font-display">Medical ID</h1>
        </div>
        <div className="space-y-4">
          <div className="glass p-6 rounded-3xl flex flex-col items-center text-center">
            <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-full mb-4 border-2 border-red-500" referrerPolicy="no-referrer" />
            <h2 className="text-xl font-bold">{profile.username}</h2>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            {[
              { label: 'Blood Type', value: 'O+' },
              { label: 'Allergies', value: 'None' },
              { label: 'Medications', value: 'None' },
              { label: 'Emergency Contact', value: 'Nova (+1 555-0123)' }
            ].map(item => (
              <div key={item.label} className="p-4 border-b border-white/5">
                <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1">{item.label}</div>
                <div className="font-medium">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'accessibility') {
    return (
      <div className="h-full bg-zinc-950 text-white p-6 overflow-y-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveSection('main')} className="p-2 bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
          <h1 className="text-2xl font-bold font-display">Accessibility</h1>
        </div>
        <div className="space-y-4">
          <div className="glass rounded-2xl p-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Type className="text-zinc-400" size={20} />
                <div className="flex flex-col">
                  <span className="font-bold">Font Size</span>
                  <span className="text-[10px] text-zinc-500">Adjust text size for better readability</span>
                </div>
              </div>
              <span className="text-purple-400 font-bold">Medium</span>
            </div>
            <button 
              onClick={() => setReduceMotion(!reduceMotion)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Zap className="text-zinc-400" size={20} />
                <div className="flex flex-col text-left">
                  <span className="font-bold">Reduce Motion</span>
                  <span className="text-[10px] text-zinc-500">Minimize animations and transitions</span>
                </div>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${reduceMotion ? 'bg-purple-600' : 'bg-zinc-800'}`}>
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
        </div>
      </div>
    );
  }

  return (
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
          </div>
        </section>

        <section className="glass rounded-2xl p-4 space-y-4">
          {[
            { icon: Bell, label: 'Notifications', color: 'text-red-400', section: null },
            { icon: Lock, label: 'Privacy & Security', color: 'text-green-400', section: null },
            { icon: Shield, label: 'Safety & Emergency', color: 'text-red-500', section: 'safety' },
            { icon: Accessibility, label: 'Accessibility', color: 'text-purple-400', section: 'accessibility' },
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
  const [time, setTime] = useState(new Date());
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
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

  // Quick Settings States
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [flashlightEnabled, setFlashlightEnabled] = useState(false);
  const [brightness, setBrightness] = useState(80);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('nebula_theme', JSON.stringify(theme));
    localStorage.setItem('nebula_accent', accentColor);
    localStorage.setItem('nebula_profile', JSON.stringify(profile));
    localStorage.setItem('nebula_installed_apps', JSON.stringify(installedAppIds));
    localStorage.setItem('nebula_wallpaper', wallpaper);
    localStorage.setItem('nebula_reduce_motion', reduceMotion.toString());
    localStorage.setItem('nebula_device_name', deviceName);
  }, [theme, accentColor, profile, installedAppIds, wallpaper, reduceMotion, deviceName]);

  const apps: AppConfig[] = [
    { id: 'browser', name: 'Browser', icon: Globe, color: 'bg-blue-500', component: BrowserApp },
    { id: 'weather', name: 'Weather', icon: Cloud, color: 'bg-sky-400', component: WeatherApp },
    { id: 'music', name: 'Music', icon: MusicIcon, color: 'bg-purple-600', component: MusicApp },
    { id: 'appstore', name: 'Store', icon: ShoppingBag, color: 'bg-zinc-800', component: () => <AppStoreApp installedAppIds={installedAppIds} onInstall={toggleInstall} /> },
    { id: 'camera', name: 'Camera', icon: CameraIcon, color: 'bg-zinc-700', component: CameraApp },
    { id: 'settings', name: 'Settings', icon: SettingsIcon, color: 'bg-zinc-600', component: () => <SettingsApp theme={theme} setTheme={setTheme} accent={accentColor} setAccent={setAccentColor} profile={profile} setProfile={setProfile} onOpenProfile={() => setActiveApp('profile')} wallpaper={wallpaper} setWallpaper={setWallpaper} reduceMotion={reduceMotion} setReduceMotion={setReduceMotion} deviceName={deviceName} setDeviceName={setDeviceName} /> },
    { id: 'profile', name: 'Profile', icon: User, color: 'bg-indigo-500', component: () => <ProfileApp profile={profile} setProfile={setProfile} /> },
    { id: 'messages', name: 'Messages', icon: MessageSquare, color: 'bg-blue-500', component: MessagesApp },
    { id: 'calendar', name: 'Calendar', icon: CalendarIcon, color: 'bg-green-500', component: CalendarApp },
    { id: 'emails', name: 'Emails', icon: Mail, color: 'bg-indigo-600', component: EmailsApp },
    { id: 'paint', name: 'Paint', icon: PenTool, color: 'bg-orange-500', component: PaintApp },
    { id: 'snake', name: 'Snake', icon: Gamepad2, color: 'bg-green-600', component: SnakeApp },
    { id: 'minesweeper', name: 'Sweeper', icon: Grid3X3, color: 'bg-zinc-700', component: MinesweeperApp },
    { id: 'calculator', name: 'Calculator', icon: Calculator, color: 'bg-orange-600', component: CalculatorApp },
    { id: 'notes', name: 'Notes', icon: FileText, color: 'bg-yellow-600', component: NotesApp },
  ];

  const toggleInstall = (id: AppId) => {
    if (installedAppIds.includes(id)) {
      setActiveApp(id);
    } else {
      setInstalledAppIds([...installedAppIds, id]);
    }
  };

  const handleHomeGesture = () => {
    setActiveApp('home');
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${theme.bg} transition-colors duration-700`}>
      {/* Wallpaper */}
      <div className="absolute inset-0 z-0">
        <img src={wallpaper} alt="Wallpaper" className="w-full h-full object-cover opacity-40 blur-[2px]" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Background Nebula Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] blur-[120px] rounded-full animate-pulse" style={{ backgroundColor: `${accentColor}20` }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] blur-[120px] rounded-full animate-pulse" style={{ backgroundColor: `${accentColor}10`, animationDelay: '2s' }} />
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
                <div className="glass rounded-2xl p-3 mb-8 flex items-center gap-3 text-white/50">
                  <Search size={18} />
                  <span className="text-sm">Search apps...</span>
                </div>

                {/* App Grid - Only show installed main apps on home */}
                <div className="grid grid-cols-4 gap-6">
                  {apps.filter(a => ['browser', 'weather', 'music', 'appstore'].includes(a.id) && installedAppIds.includes(a.id)).map(app => (
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
                <div className="glass rounded-[32px] p-4 flex justify-around items-center">
                  {apps.filter(a => installedAppIds.includes(a.id)).slice(0, 4).map(app => (
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
                initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
                animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
                transition={reduceMotion ? { duration: 0.2 } : { type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute inset-0 z-40"
              >
                {apps.find(a => a.id === activeApp)?.component({})}
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
                className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-xl p-8 pt-16 flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold font-display text-white">All Apps</h2>
                  <button onClick={() => setIsAppDrawerOpen(false)} className="p-2 bg-white/10 rounded-full text-white">
                    <X size={20} />
                  </button>
                </div>

                {/* Search in Drawer */}
                <div className="glass rounded-2xl p-3 mb-8 flex items-center gap-3 text-white/50">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search apps..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full text-white"
                  />
                </div>

                <div className="grid grid-cols-4 gap-y-8 gap-x-4 overflow-y-auto pb-20">
                  {apps.filter(app => 
                    app.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                    installedAppIds.includes(app.id)
                  ).map(app => (
                    <motion.button
                      key={`drawer-${app.id}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setActiveApp(app.id);
                        setIsAppDrawerOpen(false);
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className={`${app.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg`}>
                        <app.icon className="text-white" size={28} />
                      </div>
                      <span className="text-[10px] text-white font-medium">{app.name}</span>
                    </motion.button>
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
